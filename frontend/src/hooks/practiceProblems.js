import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cheatSheetProblems';

const createClientId = () => `problem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load practice problems from localStorage', error);
    return null;
  }
};

const saveToStorage = (problems) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  } catch (error) {
    console.error('Failed to save practice problems to localStorage', error);
  }
};

const flattenProblemErrors = (errorData = {}) => {
  const entries = Object.entries(errorData || {});

  if (entries.length === 0) {
    return ['Failed to save practice problem.'];
  }

  return entries.flatMap(([field, value]) => {
    const messages = Array.isArray(value) ? value : [value];
    return messages.map((message) => {
      if (field === 'non_field_errors' || field === 'detail' || field === 'error') {
        return String(message);
      }

      return `${field}: ${message}`;
    });
  });
};

const normalizeProblem = (problem = {}, index = 0) => ({
  clientId: problem.clientId || `problem-${problem.id ?? index}-${index}`,
  id: problem.id ?? null,
  label: problem.label ?? '',
  sourceText: problem.sourceText ?? problem.source_text ?? '',
  sourceFormat: problem.sourceFormat ?? problem.source_format ?? 'simple_v1',
  compiledLatex: problem.compiledLatex ?? problem.compiled_latex ?? '',
  order: problem.order ?? index + 1,
  errors: Array.isArray(problem.errors) ? problem.errors : [],
});

export function usePracticeProblems(initialData) {
  const initialProblems = useMemo(() => {
    const savedProblems = loadFromStorage();
    if (Array.isArray(savedProblems) && savedProblems.length > 0) {
      return savedProblems.map((problem, index) => normalizeProblem(problem, index));
    }

    return (initialData?.practiceProblems || initialData?.problems || []).map((problem, index) =>
      normalizeProblem(problem, index)
    );
  }, [initialData]);

  const [problems, setProblems] = useState(initialProblems);
  const [removedProblemIds, setRemovedProblemIds] = useState([]);

  useEffect(() => {
    saveToStorage(problems);
  }, [problems]);

  const addProblem = useCallback(() => {
    setProblems((prev) => [
      ...prev,
      normalizeProblem(
        {
          clientId: createClientId(),
          label: '',
          sourceText: '',
          sourceFormat: 'simple_v1',
          compiledLatex: '',
          order: prev.length + 1,
        },
        prev.length
      ),
    ]);
  }, []);

  const updateProblem = useCallback((clientId, field, value) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.clientId === clientId
          ? {
              ...problem,
              [field]: value,
              errors: [],
            }
          : problem
      )
    );
  }, []);

  const removeProblem = useCallback((clientId) => {
    setProblems((prev) => {
      const next = prev.filter((problem) => problem.clientId !== clientId);
      const removedProblem = prev.find((problem) => problem.clientId === clientId);

      if (removedProblem?.id) {
        setRemovedProblemIds((current) => [...current, removedProblem.id]);
      }

      return next.map((problem, index) => ({
        ...problem,
        order: index + 1,
      }));
    });
  }, []);

  const reorderProblems = useCallback((oldIndex, newIndex) => {
    setProblems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);

      return next.map((problem, index) => ({
        ...problem,
        order: index + 1,
      }));
    });
  }, []);

  const clearProblems = useCallback(() => {
    setProblems([]);
    setRemovedProblemIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const serializeProblems = useCallback(
    () =>
      problems.map((problem, index) => ({
        id: problem.id,
        label: problem.label,
        source_text: problem.sourceText,
        source_format: problem.sourceFormat,
        compiled_latex: problem.compiledLatex,
        order: index + 1,
      })),
    [problems]
  );

  const syncProblems = useCallback(
    async (cheatSheetId) => {
      if (!cheatSheetId) {
        throw new Error('Save the cheat sheet before saving practice problems.');
      }

      const nextProblems = problems.map((problem, index) => ({
        ...problem,
        order: index + 1,
        errors: [],
      }));
      const originalProblemsById = new Map(
        problems.filter((problem) => problem.id).map((problem) => [problem.id, normalizeProblem(problem)])
      );
      const createdProblemIds = [];
      const updatedProblemIds = [];

      const rollbackMutations = async () => {
        await Promise.allSettled([
          ...createdProblemIds.map((problemId) =>
            fetch(`/api/problems/${problemId}/`, {
              method: 'DELETE',
            })
          ),
          ...updatedProblemIds.map((problemId) => {
            const originalProblem = originalProblemsById.get(problemId);
            if (!originalProblem) {
              return Promise.resolve();
            }

            return fetch(`/api/problems/${problemId}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cheat_sheet: cheatSheetId,
                label: originalProblem.label,
                source_text: originalProblem.sourceText,
                source_format: originalProblem.sourceFormat,
                order: originalProblem.order,
              }),
            });
          }),
        ]);
      };

      for (let index = 0; index < nextProblems.length; index += 1) {
        const problem = nextProblems[index];
        const payload = {
          cheat_sheet: cheatSheetId,
          label: problem.label,
          source_text: problem.sourceText,
          source_format: problem.sourceFormat,
          order: index + 1,
        };

        const response = await fetch(problem.id ? `/api/problems/${problem.id}/` : '/api/problems/', {
          method: problem.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          await rollbackMutations();
          nextProblems[index] = {
            ...problem,
            errors: flattenProblemErrors(errorData),
          };
          setProblems(nextProblems);
          throw new Error(nextProblems[index].errors[0] || 'Failed to save practice problem.');
        }

        const savedProblem = await response.json();
        nextProblems[index] = normalizeProblem(savedProblem, index);

        if (problem.id) {
          updatedProblemIds.push(problem.id);
        } else if (savedProblem.id) {
          createdProblemIds.push(savedProblem.id);
        }
      }

      for (const removedId of removedProblemIds) {
        const response = await fetch(`/api/problems/${removedId}/`, { method: 'DELETE' });
        if (!response.ok && response.status !== 404) {
          throw new Error('Failed to delete a removed practice problem.');
        }
      }

      setProblems(nextProblems);
      setRemovedProblemIds([]);
      return nextProblems.map((problem, index) => normalizeProblem(problem, index));
    },
    [problems, removedProblemIds]
  );

  return {
    problems,
    addProblem,
    updateProblem,
    removeProblem,
    reorderProblems,
    clearProblems,
    serializeProblems,
    syncProblems,
  };
}

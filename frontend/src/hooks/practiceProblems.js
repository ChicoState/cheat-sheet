import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

const serializeProblemsForStorage = (problems) =>
  problems.map((problem, index) => ({
    clientId: problem.clientId,
    id: problem.id,
    label: problem.label,
    source_text: problem.sourceText,
    source_format: problem.sourceFormat,
    order: problem.order ?? index + 1,
  }));

const saveToStorage = (problems) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeProblemsForStorage(problems)));
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

const getSaveValidationErrors = (problem) => {
  if (!problem.sourceText.trim()) {
    return ['Add problem source or delete this block before saving.'];
  }

  return [];
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
  isPreviewing: Boolean(problem.isPreviewing),
  isDirty: Boolean(problem.isDirty),
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
  const problemsRef = useRef(initialProblems);
  const previewRequestIdsRef = useRef(new Map());

  useEffect(() => {
    problemsRef.current = problems;
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
              isDirty: field === 'label' || field === 'sourceText' ? true : problem.isDirty,
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

      previewRequestIdsRef.current.delete(clientId);

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
    previewRequestIdsRef.current.clear();
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearProblemPreview = useCallback((clientId) => {
    previewRequestIdsRef.current.set(clientId, (previewRequestIdsRef.current.get(clientId) || 0) + 1);

    setProblems((prev) =>
      prev.map((problem) => {
        if (problem.clientId !== clientId) {
          return problem;
        }

        if (!problem.compiledLatex && problem.errors.length === 0 && !problem.isPreviewing) {
          return problem;
        }

        return {
          ...problem,
          compiledLatex: '',
          errors: [],
          isPreviewing: false,
        };
      })
    );
  }, []);

  const requestProblemPreview = useCallback(async (problem) => {
    try {
      const response = await fetch('/api/problems/preview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: problem.label,
          source_text: problem.sourceText,
          source_format: problem.sourceFormat,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          compiledLatex: '',
          errors: flattenProblemErrors(data),
          data: null,
        };
      }

      const errors = Array.isArray(data.errors)
        ? data.errors.map((error) => `Line ${error.line}: ${error.message}`)
        : [];

      return {
        compiledLatex: data.compiled_latex || '',
        errors,
        data,
      };
    } catch {
      return {
        compiledLatex: '',
        errors: ['Failed to preview practice problem.'],
        data: null,
      };
    }
  }, []);

  const previewProblem = useCallback(async (clientId) => {
    const currentProblem = problemsRef.current.find((problem) => problem.clientId === clientId);

    if (!currentProblem) {
      return null;
    }

    if (!currentProblem.sourceText.trim()) {
      clearProblemPreview(clientId);
      return null;
    }

    const nextRequestId = (previewRequestIdsRef.current.get(clientId) || 0) + 1;
    previewRequestIdsRef.current.set(clientId, nextRequestId);

    setProblems((prev) =>
      prev.map((problem) =>
        problem.clientId === clientId
          ? {
              ...problem,
              isPreviewing: true,
              errors: [],
            }
          : problem
      )
    );

    try {
      const result = await requestProblemPreview(currentProblem);

      if (previewRequestIdsRef.current.get(clientId) !== nextRequestId) {
        return null;
      }

      setProblems((prev) =>
        prev.map((problem) =>
          problem.clientId === clientId
            ? {
                ...problem,
                isPreviewing: false,
                errors: result.errors,
                compiledLatex: result.compiledLatex,
                isDirty: result.errors.length > 0 ? problem.isDirty : false,
              }
            : problem
        )
      );

      return result.data;
    } catch {
      if (previewRequestIdsRef.current.get(clientId) !== nextRequestId) {
        return null;
      }

      setProblems((prev) =>
        prev.map((problem) =>
          problem.clientId === clientId
            ? {
                ...problem,
                isPreviewing: false,
                errors: ['Failed to preview practice problem.'],
                compiledLatex: '',
              }
            : problem
        )
      );
      return null;
    }
  }, [clearProblemPreview, requestProblemPreview]);

  const validateProblemsForSave = useCallback(async () => {
    const orderedProblems = problemsRef.current.map((problem, index) => ({
      ...problem,
      order: index + 1,
    }));

    const problemsWithLocalErrors = orderedProblems.map((problem) => {
      const errors = getSaveValidationErrors(problem);

      return errors.length > 0
        ? {
            ...problem,
            errors,
            compiledLatex: '',
            isPreviewing: false,
          }
        : problem;
    });

    if (problemsWithLocalErrors.some((problem) => problem.errors.length > 0)) {
      setProblems(problemsWithLocalErrors);
      throw new Error('Add problem source or delete incomplete practice problem blocks before saving.');
    }

    const validatedProblems = await Promise.all(
      orderedProblems.map(async (problem) => {
        if (!problem.sourceText.trim() || (!problem.isDirty && problem.compiledLatex)) {
          return problem;
        }

        previewRequestIdsRef.current.set(
          problem.clientId,
          (previewRequestIdsRef.current.get(problem.clientId) || 0) + 1
        );

        const result = await requestProblemPreview(problem);

        return {
          ...problem,
          compiledLatex: result.compiledLatex,
          errors: result.errors,
          isPreviewing: false,
          isDirty: result.errors.length > 0 ? problem.isDirty : false,
        };
      })
    );

    setProblems(validatedProblems);

    const blockingProblem = validatedProblems.find(
      (problem) => problem.errors.length > 0 || (problem.sourceText.trim() && !problem.compiledLatex)
    );

    if (blockingProblem) {
      throw new Error('Fix practice problem errors before saving.');
    }

    return validatedProblems;
  }, [requestProblemPreview]);

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
    clearProblemPreview,
    previewProblem,
    validateProblemsForSave,
    serializeProblems,
    syncProblems,
  };
}

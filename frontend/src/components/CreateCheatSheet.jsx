import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormulas } from '../hooks/formulas';
import { usePracticeProblems } from '../hooks/practiceProblems';
import { useLatex } from '../hooks/latex';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function SortableFormulaItem({ id, formula, onRemove, className }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ 
    id,
    data: { type: 'formula', class: formula.class }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-formula-item ${className || ''}`}>
      <span className="drag-handle" {...attributes} {...listeners}>⋮⋮</span>
      <span className="formula-name" style={{ fontStyle: 'italic' }}>{formula.name}</span>
      <span className="formula-class" style={{ fontStyle: 'italic' }}>{formula.class}</span>
      <button 
        type="button" 
        className="remove-formula" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ×
      </button>
    </div>
  );
}

function SortableClassGroup({ group, isCollapsed, onToggleCollapse, onRemoveClass, onRemoveFormula }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ 
    id: `class-${group.class}`,
    data: { type: 'class' }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className={`formula-class-group ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="class-group-header" 
        onClick={onToggleCollapse}
        {...attributes} 
        {...listeners}
      >
        <div className="class-group-main">
          <span className="drag-handle">⋮⋮</span>
          <span className="collapse-icon">{isCollapsed ? '▶' : '▼'}</span>
          <span 
            className="class-group-title" 
            style={{ fontWeight: 'bold', marginLeft: '0.5rem' }}
          >
            {group.class} ({group.formulas.length})
          </span>
        </div>
        <div className="class-group-actions">
          <button 
            type="button" 
            className="class-group-btn remove" 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveClass(group.class);
            }} 
            title="Remove all"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="class-group-formulas">
          <SortableContext items={group.formulas.map(f => `formula-${group.class}-${f.category}-${f.name}`)} strategy={verticalListSortingStrategy}>
            {group.formulas.map(f => (
              <SortableFormulaItem 
                key={`${f.category}-${f.name}`}
                id={`formula-${group.class}-${f.category}-${f.name}`}
                formula={f}
                className="nested"
                onRemove={() => onRemoveFormula(f.category, f.name)}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

function FormulaReorderPanel({ groupedFormulas, onReorderClass, onReorderFormula, onRemoveClass, onRemoveFormula }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [expandedGroups, setExpandedGroups] = React.useState({});

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    
    if (activeType === 'class' && overType === 'class') {
      const oldIndex = groupedFormulas.findIndex(g => `class-${g.class}` === active.id);
      const newIndex = groupedFormulas.findIndex(g => `class-${g.class}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderClass(oldIndex, newIndex);
      }
    } else if (activeType === 'formula' && overType === 'formula') {
      const activeClass = active.data.current?.class;
      const overClass = over.data.current?.class;
      
      if (activeClass === overClass) {
        const group = groupedFormulas.find(g => g.class === activeClass);
        if (group) {
          const oldIndex = group.formulas.findIndex(f => `formula-${activeClass}-${f.category}-${f.name}` === active.id);
          const newIndex = group.formulas.findIndex(f => `formula-${overClass}-${f.category}-${f.name}` === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            onReorderFormula(activeClass, oldIndex, newIndex);
          }
        }
      }
    }
  };

  const toggleGroup = (className) => {
    setExpandedGroups(prev => ({ ...prev, [className]: !prev[className] }));
  };

  if (groupedFormulas.length === 0) return null;

  return (
    <div className="formula-reorder-panel">
      <label style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', display: 'block' }}>
        Drag to reorder formulas (top appears first in PDF)
      </label>
      <div className="reorder-instructions">
        <span>Click the bar to collapse. Click and hold to move.</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groupedFormulas.map(g => `class-${g.class}`)} strategy={verticalListSortingStrategy}>
          {groupedFormulas.map(group => (
            <SortableClassGroup 
              key={group.class}
              group={group}
              isCollapsed={!expandedGroups[group.class]}
              onToggleCollapse={() => toggleGroup(group.class)}
              onRemoveClass={onRemoveClass}
              onRemoveFormula={(categoryName, formulaName) => onRemoveFormula(group.class, categoryName, formulaName)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

const FormulaSelection = ({ 
  classesData, 
  selectedClasses, 
  selectedCategories, 
  groupedFormulas,
  toggleClass, 
  toggleCategory, 
  onGenerate, 
  isGenerating, 
  selectedCount, 
  hasSelectedClasses,
  onReorderClass,
  onReorderFormula,
  onRemoveClass,
  onRemoveFormula
}) => (
  <div className="formula-selection">
    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
      Select classes
    </label>
    
    <div className="class-checkboxes">
      {classesData.map((cls) => {
        const isChecked = !!selectedClasses[cls.name];
        return (
          <label key={cls.name} className={`class-checkbox-label ${isChecked ? 'checked' : ''}`} onClick={(e) => {
            e.preventDefault();
            toggleClass(cls.name);
          }}>
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
            />
            {cls.name}
          </label>
        );
      })}
    </div>

    {hasSelectedClasses && (
      <div className="category-dropdowns">
        <label style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', display: 'block' }}>
          Select sections
        </label>
        
        {classesData.map((cls) => {
          if (!selectedClasses[cls.name]) return null;
          
          const isSpecialClass = cls.is_special || (cls.categories.length === 1 && cls.categories[0].name === cls.name);
          
          if (isSpecialClass) {
            return (
              <div key={cls.name} className="class-category-section">
                <p style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>
                  ✓ {cls.name} selected - all formulas included
                </p>
              </div>
            );
          }
          
          return (
            <div key={cls.name} className="class-category-section">
              <label className="class-category-label">{cls.name}:</label>
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={cls.categories.every(cat => selectedCategories[`${cls.name}:${cat.name}`])}
                  onChange={() => {
                    const allSelected = cls.categories.every(cat => selectedCategories[`${cls.name}:${cat.name}`]);
                    cls.categories.forEach(cat => {
                      if (allSelected) {
                        toggleCategory(cls.name, cat.name);
                      } else if (!selectedCategories[`${cls.name}:${cat.name}`]) {
                        toggleCategory(cls.name, cat.name);
                      }
                    });
                  }}
                />
                Include all sections
              </label>
              <div className="category-checkboxes">
                {cls.categories.map((cat) => {
                  const key = `${cls.name}:${cat.name}`;
                  const isChecked = !!selectedCategories[key];
                  return (
                    <label key={cat.name} className={`category-checkbox-label ${isChecked ? 'checked' : ''}`} onClick={(e) => {
                      e.preventDefault();
                      toggleCategory(cls.name, cat.name);
                    }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                      />
                      {cat.name} ({cat.formulas.length} formulas)
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    )}

    <FormulaReorderPanel 
      groupedFormulas={groupedFormulas} 
      onReorderClass={onReorderClass}
      onReorderFormula={onReorderFormula}
      onRemoveClass={onRemoveClass}
      onRemoveFormula={onRemoveFormula}
    />

    <button
      type="button"
      onClick={onGenerate}
      className="btn primary generate-btn"
      disabled={isGenerating || selectedCount === 0}
    >
      {isGenerating ? 'Generating...' : 'Generate Cheat Sheet'}
    </button>

    {selectedCount > 0 && (
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
        {selectedCount} formula(s) will be included
      </p>
    )}
  </div>
);

function SortableProblemBlock({ problem, onChange, onRemove, onPreview, onClearPreview, disabled = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: problem.clientId,
    data: { type: 'problem' },
  });

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    if (!problem.sourceText.trim()) {
      if (!problem.errors?.length) {
        onClearPreview(problem.clientId);
      }
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onPreview(problem.clientId);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [problem.clientId, problem.label, problem.sourceText, problem.errors?.length, onPreview, onClearPreview, disabled]);

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className="practice-problem-card">
      <div className="practice-problem-card-header">
        <div className="practice-problem-card-title">
          <span className="drag-handle" {...(disabled ? {} : attributes)} {...(disabled ? {} : listeners)}>⋮⋮</span>
          <div>
            <strong>{problem.label?.trim() || 'Untitled problem block'}</strong>
            <div className="practice-problem-card-subtitle">Drag to set block order in the saved PDF</div>
          </div>
        </div>
        <button type="button" className="class-group-btn remove" onClick={() => onRemove(problem.clientId)} disabled={disabled}>
          Delete
        </button>
      </div>

      <div className="practice-problem-fields">
        <div className="practice-problem-field">
          <label htmlFor={`problem-label-${problem.clientId}`}>Block label</label>
          <input
            id={`problem-label-${problem.clientId}`}
            type="text"
            value={problem.label}
            onChange={(event) => onChange(problem.clientId, 'label', event.target.value)}
            placeholder="Quadratic factoring"
            className="input-field practice-problem-input"
            disabled={disabled}
          />
        </div>

        <div className="practice-problem-field">
          <label htmlFor={`problem-source-${problem.clientId}`}>Problem source</label>
          <textarea
            id={`problem-source-${problem.clientId}`}
            value={problem.sourceText}
            onChange={(event) => onChange(problem.clientId, 'sourceText', event.target.value)}
            placeholder={"problem:\n    text: Solve for x\n    math: x^2 - 5x + 6 = 0\n\nsteps:\n    text: Factor the trinomial\n    math: x^2 - 5x + 6 = (x - 2)(x - 3)"}
            className="practice-problem-textarea"
            rows={9}
            spellCheck="false"
            disabled={disabled}
          />
        </div>
      </div>

      {problem.errors?.length > 0 && (
        <div className="practice-problem-errors">
          {problem.errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}

      <div className="practice-problem-preview-card">
        <div className="practice-problem-preview-header">
          <span>Compiled block preview</span>
          <span className={`practice-problem-preview-status ${problem.errors?.length > 0 ? 'error' : problem.isPreviewing ? 'loading' : problem.compiledLatex ? 'ready' : ''}`}>
            {problem.isPreviewing
              ? 'Checking syntax...'
              : problem.errors?.length > 0
                ? 'Fix errors to preview'
                : problem.compiledLatex
                  ? problem.isDirty
                    ? 'Preview ready — save to persist'
                    : 'Preview ready'
                  : 'Start typing to preview'}
          </span>
        </div>
        <pre className="practice-problem-preview">{problem.compiledLatex || 'No compiled output yet.'}</pre>
      </div>
    </div>
  );
}

function PracticeProblemEditor({ problems, onAddProblem, onChangeProblem, onRemoveProblem, onReorderProblems, onPreviewProblem, onClearPreview, disabled = false, isValidating = false }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (disabled) {
      return;
    }

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = problems.findIndex((problem) => problem.clientId === active.id);
    const newIndex = problems.findIndex((problem) => problem.clientId === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderProblems(oldIndex, newIndex);
    }
  };

  return (
    <div className="practice-problem-section">
      <div className="practice-problem-section-header">
        <div>
          <label className="practice-problem-section-label">Practice problem blocks</label>
          <p className="practice-problem-section-copy">
            Author problems in <code>simple_v1</code>, drag them into order, and save to include them in the compiled PDF preview.
          </p>
          {isValidating && (
            <p className="practice-problem-section-status">Validating practice problems before save…</p>
          )}
        </div>
        <button type="button" className="btn primary" onClick={onAddProblem} disabled={disabled}>Add problem block</button>
      </div>

      <details className="practice-problem-help">
        <summary>Syntax help</summary>
        <pre>{`problem:\n    text: Solve for x\n    math: x^2 - 5x + 6 = 0\n\nsteps:\n    text: Factor the trinomial\n    math: x^2 - 5x + 6 = (x - 2)(x - 3)\n    text: Therefore x = 2 or x = 3`}</pre>
      </details>

      {problems.length === 0 ? (
        <div className="practice-problem-empty">
          No practice problems yet. Add a block to start writing compiler-backed problems.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={problems.map((problem) => problem.clientId)} strategy={verticalListSortingStrategy}>
            <div className="practice-problem-list">
              {problems.map((problem) => (
                <SortableProblemBlock
                  key={problem.clientId}
                  problem={problem}
                  onChange={onChangeProblem}
                  onRemove={onRemoveProblem}
                  onPreview={onPreviewProblem}
                  onClearPreview={onClearPreview}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

const COMPILE_ERROR_LINE_REGEX = /document\.tex:(\d+):/g;

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const highlightLatexLine = (line = '') => {
  const placeholders = [];
  const stashToken = (html) => {
    const placeholder = `LATEXTOKEN${placeholders.length}PLACEHOLDER`;
    placeholders.push(html);
    return placeholder;
  };

  let html = escapeHtml(line);

  html = html.replace(/%.*$/g, (match) => stashToken(`<span class="latex-token comment">${match}</span>`));
  html = html.replace(/\\[a-zA-Z@]+|\\./g, (match) => stashToken(`<span class="latex-token command">${match}</span>`));
  html = html.replace(/[{}[\]]/g, (match) => `<span class="latex-token brace">${match}</span>`);
  html = html.replace(/[$&#_^]/g, (match) => `<span class="latex-token symbol">${match}</span>`);

  html = html.replace(/LATEXTOKEN(\d+)PLACEHOLDER/g, (_, index) => placeholders[Number(index)] ?? '');

  return html || '&nbsp;';
};

const extractCompileErrorLines = (compileError = '') => {
  const normalizedError = compileError || '';
  const lineNumbers = new Set();

  for (const match of normalizedError.matchAll(COMPILE_ERROR_LINE_REGEX)) {
    lineNumbers.add(Number(match[1]));
  }

  return lineNumbers;
};

const getCompileErrorSummary = (compileError = '') => {
  const normalizedError = compileError || '';

  if (!normalizedError) {
    return '';
  }

  const lineMatch = normalizedError.match(/document\.tex:(\d+):\s*([^\n]+)/);
  if (lineMatch) {
    return `Line ${lineMatch[1]}: ${lineMatch[2].replace(/^error:\s*/i, '').trim()}`;
  }

  return (normalizedError.split('\n').find((line) => line.trim()) || '').replace(/^error:\s*/i, '').trim();
};

const LatexEditor = ({ content, onChange, isModified, compileError }) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightLayerRef = useRef(null);

  const errorLines = useMemo(() => extractCompileErrorLines(compileError), [compileError]);
  const compileErrorSummary = useMemo(() => getCompileErrorSummary(compileError), [compileError]);
  const highlightedLines = useMemo(() => {
    const lines = content ? content.split('\n') : [''];

    return lines.map((line, index) => ({
      lineNumber: index + 1,
      highlightedHtml: highlightLatexLine(line),
      hasError: errorLines.has(index + 1),
    }));
  }, [content, errorLines]);

  const lineCount = highlightedLines.length;

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }

    if (highlightLayerRef.current && textareaRef.current) {
      highlightLayerRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightLayerRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="input-section">
      <label htmlFor="content">Generated LaTeX Code:</label>
      {compileErrorSummary ? (
        <div className="editor-status error">{compileErrorSummary}</div>
      ) : isModified ? (
        <div className="editor-status modified">Manual edits ready to recompile</div>
      ) : null}
      <div className={`editor-wrapper ${compileErrorSummary ? 'has-error' : ''}`}>
        <div className="line-numbers" ref={lineNumbersRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className={`line-number ${errorLines.has(i + 1) ? 'error' : ''}`}>{i + 1}</div>
          ))}
        </div>
        <div className="editor-surface">
          <div className={`editor-highlight-layer ${isModified ? 'modified' : ''}`} ref={highlightLayerRef} aria-hidden="true">
            {highlightedLines.map(({ lineNumber, highlightedHtml, hasError }) => (
              <div
                key={lineNumber}
                className={`editor-highlight-line ${hasError ? 'error' : ''}`}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ))}
          </div>
          <textarea
            ref={textareaRef}
            id="content"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder='Select classes and categories above, then click "Generate Cheat Sheet" to see the LaTeX code here.'
            className={`textarea-field ${isModified ? 'modified' : ''}`}
            rows={15}
            spellCheck="false"
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

const PdfPreview = ({ pdfBlob, compileError }) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new window.ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="preview-section">
      <label>PDF Preview:</label>
      <div 
        className="preview-box pdf-viewer-box" 
        ref={containerRef}
      >
        {compileError ? (
          <div style={{ padding: '20px', color: '#ff4444', backgroundColor: '#331111', borderRadius: '4px', border: '1px solid #ff4444', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
            <strong>Compilation Error:</strong><br /><br />
            {compileError}
          </div>
        ) : pdfBlob ? (
          <Document 
            file={pdfBlob} 
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div style={{ padding: '2rem', color: '#666', textAlign: 'center' }}>Loading PDF...</div>}
            error={<div style={{ padding: '2rem', color: '#ff4444', textAlign: 'center' }}>Failed to load PDF.</div>}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="pdf-page"
                width={containerWidth ? containerWidth : undefined}
              />
            ))}
          </Document>
        ) : (
          <div className="latex-content" style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
            Generate a sheet to see the PDF.
          </div>
        )}
      </div>
    </div>
  );
};

const ActionToolbar = ({ handleDownloadTex, handleDownloadPDF, isLoading, isSaving, isSubmitting, canDownloadPDF, handleClear }) => (
  <div className="actions">
    <button type="submit" className="btn primary" disabled={isSaving || isSubmitting}>{isSaving ? 'Saving...' : isSubmitting ? 'Validating...' : 'Save Progress'}</button>
    <button type="button" onClick={handleDownloadTex} className="btn download" disabled={isSubmitting}>Download .tex</button>
    <button
      type="button"
      onClick={handleDownloadPDF}
      className="btn download"
      disabled={isLoading || isSubmitting || !canDownloadPDF}
    >
      {isLoading ? 'Compiling...' : 'Download PDF'}
    </button>
    <button type="button" onClick={handleClear} className="btn clear" disabled={isSubmitting}>Clear</button>
  </div>
);

const LayoutOptions = ({ columns, setColumns, fontSize, setFontSize, spacing, setSpacing, margins, setMargins }) => (
  <div className="layout-options">
    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
      Layout Options
    </label>
    <div className="layout-controls">
      <div className="layout-control">
        <label htmlFor="columns">Columns:</label>
        <select 
          id="columns" 
          value={columns} 
          onChange={(e) => setColumns(Number(e.target.value))}
          className="layout-select"
        >
          <option value={1}>1 Column</option>
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </div>
      <div className="layout-control">
        <label htmlFor="fontSize">Text Size:</label>
        <select 
          id="fontSize" 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
          className="layout-select"
        >
          <option value="8pt">Compact (8pt)</option>
          <option value="9pt">Small (9pt)</option>
          <option value="10pt">Normal (10pt)</option>
          <option value="11pt">Medium (11pt)</option>
          <option value="12pt">Large (12pt)</option>
        </select>
      </div>
      <div className="layout-control">
        <label htmlFor="spacing">Spacing:</label>
        <select 
          id="spacing" 
          value={spacing} 
          onChange={(e) => setSpacing(e.target.value)}
          className="layout-select"
        >
          <option value="tiny">Tiny</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="layout-control">
        <label htmlFor="margins">Margins:</label>
        <select 
          id="margins" 
          value={margins} 
          onChange={(e) => setMargins(e.target.value)}
          className="layout-select"
        >
          <option value="0.15in">Narrow (0.15in)</option>
          <option value="0.25in">Normal (0.25in)</option>
          <option value="0.5in">Wide (0.5in)</option>
          <option value="0.75in">Extra Wide (0.75in)</option>
        </select>
      </div>
    </div>
  </div>
);

const CreateCheatSheet = ({ onSave, onReset, initialData, isSaving = false }) => {
  const [isSubmittingProblems, setIsSubmittingProblems] = useState(false);
  const {
    classesData,
    selectedClasses,
    selectedCategories,
    groupedFormulas,
    toggleClass,
    toggleCategory,
    getSelectedFormulasList,
    clearSelections,
    reorderClass,
    reorderFormula,
    removeClassFromOrder,
    removeSingleFormula,
    selectedCount,
    hasSelectedClasses
  } = useFormulas(initialData);

  const {
    problems,
    addProblem,
    updateProblem,
    removeProblem,
    reorderProblems,
    clearProblems,
    clearProblemPreview,
    previewProblem,
    validateProblemsForSave,
    syncProblems,
  } = usePracticeProblems(initialData);

  const {
    title,
    setTitle,
    content,
    contentModified,
    handleContentChange,
    columns,
    setColumns,
    fontSize,
    setFontSize,
    spacing,
    setSpacing,
    margins,
    setMargins,
    pdfBlob,
    isGenerating,
    isCompiling,
    isLoading,
    compileError,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    handleGenerateSheet,
    handleCompileOnly,
    compileSavedSheet,
    handleDownloadPDF,
    handleDownloadTex,
    clearLatex
  } = useLatex(initialData);

  const handleCompileClick = () => {
    handleCompileOnly();
  };

  const handleGenerate = () => {
    const formulasList = getSelectedFormulasList();
    handleGenerateSheet(formulasList);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (isSaving || isSubmittingProblems) {
      return;
    }

    setIsSubmittingProblems(true);

    try {
      const validatedProblems = await validateProblemsForSave();
      const basePayload = {
        title,
        content,
        columns,
        fontSize,
        spacing,
        margins,
        selectedFormulas: getSelectedFormulasList(),
        practiceProblems: validatedProblems.map((problem, index) => ({
          id: problem.id,
          label: problem.label,
          source_text: problem.sourceText,
          source_format: problem.sourceFormat,
          compiled_latex: problem.compiledLatex,
          order: problem.order ?? index + 1,
        })),
      };

      const persistedSheet = await onSave(basePayload, { showFeedback: false });
      const persistedProblems = await syncProblems(persistedSheet.id);
      await onSave(
        {
          ...basePayload,
          id: persistedSheet.id,
          practiceProblems: persistedProblems.map((problem) => ({
            id: problem.id,
            label: problem.label,
            source_text: problem.sourceText,
            source_format: problem.sourceFormat,
            compiled_latex: problem.compiledLatex,
            order: problem.order,
          })),
        },
        { persistOnly: true }
      );
      await compileSavedSheet(persistedSheet.id);
      alert('Progress saved!');
    } catch (error) {
      console.error('Failed to save practice problems', error);
      const message = error?.message || 'Failed to save progress.';
      const isValidationError = [
        'Add problem source or delete incomplete practice problem blocks before saving.',
        'Fix practice problem errors before saving.',
      ].includes(message);
      alert(isValidationError ? message : `Failed to save progress: ${message}`);
    } finally {
      setIsSubmittingProblems(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear everything? This cannot be undone.')) {
      clearLatex();
      clearSelections();
      clearProblems();
      onReset?.();
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* Box 1: Selection controls */}
      <div className="create-cheat-sheet panel-box selection-panel">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Math Cheat Sheet"
            required
            className="input-field"
          />
        </div>

        <FormulaSelection
          classesData={classesData}
          selectedClasses={selectedClasses}
          selectedCategories={selectedCategories}
          groupedFormulas={groupedFormulas}
          toggleClass={toggleClass}
          toggleCategory={toggleCategory}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedCount={selectedCount}
          hasSelectedClasses={hasSelectedClasses}
          onReorderClass={reorderClass}
          onReorderFormula={reorderFormula}
          onRemoveClass={removeClassFromOrder}
          onRemoveFormula={removeSingleFormula}
        />

        <PracticeProblemEditor
          problems={problems}
          onAddProblem={addProblem}
          onChangeProblem={updateProblem}
          onRemoveProblem={removeProblem}
          onReorderProblems={reorderProblems}
          onPreviewProblem={previewProblem}
          onClearPreview={clearProblemPreview}
          disabled={isSubmittingProblems || isSaving}
          isValidating={isSubmittingProblems && !isSaving}
        />
      </div>

      {/* Box 2: Editor and preview */}
      <div className="create-cheat-sheet panel-box">
        <LayoutOptions 
          columns={columns}
          setColumns={setColumns}
          fontSize={fontSize}
          setFontSize={setFontSize}
          spacing={spacing}
          setSpacing={setSpacing}
          margins={margins}
          setMargins={setMargins}
        />
        
        <div className="editor-container">
          <LatexEditor
            content={content}
            onChange={handleContentChange}
            isModified={contentModified}
            compileError={compileError}
          />
          <div className="compile-button-column">
            <div className="history-buttons">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="btn history-btn"
                title="Go back to previous version"
                aria-label="Go back"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goForward}
                disabled={!canGoForward}
                className="btn history-btn"
                title="Go forward to next version"
                aria-label="Go forward"
              >
                →
              </button>
            </div>
            <button
              type="button"
              onClick={handleCompileClick}
              className="btn compile-circle"
              disabled={isCompiling}
              title={isCompiling ? 'Compiling...' : 'Compile & Preview'}
              aria-label={isCompiling ? 'Compiling preview' : 'Compile and preview'}
            >
              {isCompiling ? '...' : '↻'}
            </button>
          </div>
          <PdfPreview pdfBlob={pdfBlob} compileError={compileError} />
        </div>

        <ActionToolbar
          handleDownloadTex={handleDownloadTex}
          handleDownloadPDF={() => handleDownloadPDF(initialData?.id)}
          isLoading={isLoading}
          isSaving={isSaving}
          isSubmitting={isSubmittingProblems}
          canDownloadPDF={Boolean(content || initialData?.id)}
          handleClear={handleClear}
        />
      </div>
    </form>
  );
};

export default CreateCheatSheet;

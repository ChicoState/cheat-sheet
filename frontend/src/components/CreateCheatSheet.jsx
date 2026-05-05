import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { SUBJECT_VIDEOS } from '../data/subjectVideos';
import { CSS } from '@dnd-kit/utilities';
import { useFormulas } from '../hooks/formulas';
import { useLatex } from '../hooks/latex';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PANEL_LAYOUT_STORAGE_KEY = 'editorPanelLayout';
const DEFAULT_PANEL_LAYOUT = {
  leftWidth: 280,
  rightWidth: 300,
  latexWidth: 430,
};

function loadPanelLayout() {
  try {
    const saved = localStorage.getItem(PANEL_LAYOUT_STORAGE_KEY);
    if (!saved) return DEFAULT_PANEL_LAYOUT;

    const parsed = JSON.parse(saved);
    return {
      leftWidth: Number.isFinite(parsed.leftWidth) ? parsed.leftWidth : DEFAULT_PANEL_LAYOUT.leftWidth,
      rightWidth: Number.isFinite(parsed.rightWidth) ? parsed.rightWidth : DEFAULT_PANEL_LAYOUT.rightWidth,
      latexWidth: Number.isFinite(parsed.latexWidth) ? parsed.latexWidth : DEFAULT_PANEL_LAYOUT.latexWidth,
    };
  } catch {
    return DEFAULT_PANEL_LAYOUT;
  }
}

const clampPanelWidth = (value, min, max) => Math.min(max, Math.max(min, value));


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

function CollapsiblePanelSection({ title, isOpen, onToggle, children, countBadge = null, className = '' }) {
  return (
    <section className={`left-panel-section ${className}`.trim()}>
      <button
        type="button"
        className={`left-panel-section-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="left-panel-section-title-row">
          <span className="left-panel-section-title">{title}</span>
          {countBadge ? <span className="left-panel-section-badge">{countBadge}</span> : null}
        </span>
        <span className="left-panel-section-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? <div className="left-panel-section-body">{children}</div> : null}
    </section>
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
      <div className="reorder-instructions subtle-copy">
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
  selectedCount, 
  hasSelectedClasses,
  onReorderClass,
  onReorderFormula,
  onRemoveClass,
  onRemoveFormula
}) => {
  const [classesOpen, setClassesOpen] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [reorderOpen, setReorderOpen] = useState(true);

  return (
    <div className="formula-selection">
      <CollapsiblePanelSection
        title="Select classes"
        isOpen={classesOpen}
        onToggle={() => setClassesOpen((current) => !current)}
        countBadge={selectedCount > 0 ? `${selectedCount}` : null}
      >
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

        {selectedCount > 0 && (
          <p className="subtle-copy selection-count-copy">
            {selectedCount} formula(s) will be included
          </p>
        )}
      </CollapsiblePanelSection>

      {hasSelectedClasses && (
        <CollapsiblePanelSection
          title="Select sections"
          isOpen={sectionsOpen}
          onToggle={() => setSectionsOpen((current) => !current)}
          className="category-dropdowns"
        >
          {classesData.map((cls) => {
            if (!selectedClasses[cls.name]) return null;

            const isSpecialClass = cls.is_special || (cls.categories.length === 1 && cls.categories[0].name === cls.name);

            if (isSpecialClass) {
              return (
                <div key={cls.name} className="class-category-section">
                  <p className="inline-note">
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
        </CollapsiblePanelSection>
      )}

      {groupedFormulas.length > 0 && (
        <CollapsiblePanelSection
          title="Drag to reorder formulas"
          isOpen={reorderOpen}
          onToggle={() => setReorderOpen((current) => !current)}
        >
          <FormulaReorderPanel 
            groupedFormulas={groupedFormulas} 
            onReorderClass={onReorderClass}
            onReorderFormula={onReorderFormula}
            onRemoveClass={onRemoveClass}
            onRemoveFormula={onRemoveFormula}
          />
        </CollapsiblePanelSection>
      )}
    </div>
  );
};

const COMPILE_ERROR_LINE_REGEX = /document\.tex:(\d+):/g;
const APP_LAYOUT_COMMENT_PREFIX = '% @cheatsheet-layout';

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const highlightLatexLine = (line = '') => {
  if (line.trimStart().startsWith(APP_LAYOUT_COMMENT_PREFIX)) {
    return `<span class="latex-token app-comment">${escapeHtml(line)}</span>`;
  }

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
            placeholder='Select classes and categories above, then click "Compile PDF" to see the LaTeX code here.'
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
  const [containerHeight, setContainerHeight] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('width');

  const clampZoom = (value) => Math.min(2, Math.max(0.5, value));

  const handleZoomOut = () => {
    setViewMode('custom');
    setZoom((currentZoom) => clampZoom(currentZoom - 0.15));
  };

  const handleZoomIn = () => {
    setViewMode('custom');
    setZoom((currentZoom) => clampZoom(currentZoom + 0.15));
  };

  const handleResetZoom = () => {
    setViewMode('custom');
    setZoom(1);
  };

  const handleFitToWidth = () => {
    setViewMode('width');
    setZoom(1);
  };

  const handleFitToHeight = () => {
    setViewMode('height');
    setZoom(1);
  };

  const handleWheelZoom = (event) => {
    if (!pdfBlob || compileError) return;

    event.preventDefault();
    setViewMode('custom');
    setZoom((currentZoom) => clampZoom(currentZoom + (event.deltaY < 0 ? 0.1 : -0.1)));
  };

  const pageWidth = containerWidth && viewMode !== 'height'
    ? Math.max(240, Math.round(containerWidth * (viewMode === 'width' ? 1 : zoom)))
    : undefined;

  const pageHeight = containerHeight && viewMode === 'height'
    ? Math.max(320, Math.round((containerHeight - 24) * zoom))
    : undefined;

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new window.ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="pdf-preview-shell">
      <div className="pdf-preview-toolbar">
        <span className="pdf-toolbar-note">Scroll to zoom</span>
        <div className="pdf-zoom-controls" role="toolbar" aria-label="PDF zoom controls">
          <button type="button" className="pdf-zoom-btn" onClick={handleZoomOut} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="pdf-zoom-btn pdf-zoom-readout" onClick={handleResetZoom}>
            {viewMode === 'width' ? 'Fit width' : viewMode === 'height' ? 'Fit height' : `${Math.round(zoom * 100)}%`}
          </button>
          <button type="button" className="pdf-zoom-btn" onClick={handleZoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="pdf-zoom-btn pdf-zoom-fit" onClick={handleFitToWidth}>
            Fit width
          </button>
          <button type="button" className="pdf-zoom-btn pdf-zoom-fit" onClick={handleFitToHeight}>
            Fit height
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="pdf-preview-scroll"
        onWheel={handleWheelZoom}
      >
      {compileError ? (
        <div className="compile-error-box">
          <strong>Compilation: Error:</strong><br /><br />
          {compileError}
        </div>
      ) : pdfBlob ? (
          <Document
            file={pdfBlob}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="pdf-state-message">Loading PDF...</div>}
            error={<div className="pdf-state-message pdf-state-error">Failed to load PDF.</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="pdf-page"
                  width={pageWidth}
                  height={pageHeight}
                  />

              ))}
          </Document>
      ) : (
        <div className="pdf-state-message">
          Compile the PDF to see your preview.
          </div>
      )}
      </div>
    </div>
  );
};

const FONT_SIZE_PRESETS = ['8pt', '9pt', '10pt', '11pt', '12pt'];
const SPACING_PRESETS = ['tiny', 'small', 'medium', 'large'];

const LayoutOptions = ({ columns, setColumns, fontSize, setFontSize, spacing, setSpacing, margins, setMargins }) => {
  const fontSizeMode = FONT_SIZE_PRESETS.includes(fontSize) ? fontSize : 'custom';
  const spacingMode = SPACING_PRESETS.includes(spacing) ? spacing : 'custom';

  return (
  <div className="layout-options">
    <label className="panel-label">
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
          <option value={5}>5 Columns</option>
        </select>
      </div>
      <div className="layout-control">
        <label htmlFor="fontSize">Text Size:</label>
        <select 
          id="fontSize" 
          value={fontSizeMode} 
          onChange={(e) => setFontSize(e.target.value === 'custom' ? '10.5pt' : e.target.value)}
          className="layout-select"
        >
          <option value="8pt">Compact (8pt)</option>
          <option value="9pt">Small (9pt)</option>
          <option value="10pt">Normal (10pt)</option>
          <option value="11pt">Medium (11pt)</option>
          <option value="12pt">Large (12pt)</option>
          <option value="custom">Custom</option>
        </select>
        {fontSizeMode === 'custom' && (
          <input
            type="text"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="layout-select"
            placeholder="e.g. 10.5pt"
          />
        )}
      </div>
      <div className="layout-control">
        <label htmlFor="spacing">Spacing:</label>
        <select 
          id="spacing" 
          value={spacingMode} 
          onChange={(e) => setSpacing(e.target.value === 'custom' ? '0.8pt' : e.target.value)}
          className="layout-select"
        >
          <option value="tiny">Tiny</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="custom">Custom</option>
        </select>
        {spacingMode === 'custom' && (
          <input
            type="text"
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
            className="layout-select"
            placeholder="e.g. 0.8pt"
          />
        )}
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
};

const CreateCheatSheet = ({ onSave, onReset, initialData, isSaving = false }) => {
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
    title,
    setTitle,
    content,
    contentModified,
    hasLayoutChanges,
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
    isCompiling,
    compileError,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    handleCompileOnly,
    handleDownloadPDF,
    handleDownloadTex,
    clearLatex
  } = useLatex(initialData);

  const [showLatex, setShowLatex] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [panelLayout, setPanelLayout] = useState(() => loadPanelLayout());
  const lastAutoSavedPdfRef = useRef(null);
  const getThumbnail = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  const getEmbedUrl  = (id) => `https://www.youtube.com/embed/${id}?autoplay=1`;
  const getWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

  useEffect(() => {
    localStorage.setItem(PANEL_LAYOUT_STORAGE_KEY, JSON.stringify(panelLayout));
  }, [panelLayout]);

  useEffect(() => {
    if (!pdfBlob || compileError || lastAutoSavedPdfRef.current === pdfBlob) {
      return;
    }

    lastAutoSavedPdfRef.current = pdfBlob;

    onSave({
      title,
      content,
      columns,
      fontSize,
      spacing,
      margins,
      selectedFormulas: getSelectedFormulasList(),
      compileSnapshot: {
        title,
        content,
        columns,
        fontSize,
        spacing,
        margins,
        selectedFormulas: getSelectedFormulasList(),
        compiledAt: new Date().toISOString(),
      },
    }, false).catch((error) => {
      console.error('Failed to autosave compiled sheet', error);
    });
  }, [columns, compileError, content, fontSize, getSelectedFormulasList, margins, onSave, pdfBlob, spacing, title]);

  const startResize = useCallback((panel) => (event) => {
    event.preventDefault();

    const startX = event.clientX;
    const startLayout = panelLayout;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;

      setPanelLayout(() => {
        if (panel === 'left') {
          return {
            ...startLayout,
            leftWidth: clampPanelWidth(startLayout.leftWidth + deltaX, 220, 420),
          };
        }

        if (panel === 'right') {
          return {
            ...startLayout,
            rightWidth: clampPanelWidth(startLayout.rightWidth - deltaX, 240, 420),
          };
        }

        return {
          ...startLayout,
          latexWidth: clampPanelWidth(startLayout.latexWidth + deltaX, 320, 760),
        };
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.classList.remove('is-resizing-panels');
    };

    document.body.classList.add('is-resizing-panels');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [panelLayout]);

  const appBodyGridTemplate = [
    leftPanelVisible ? `${panelLayout.leftWidth}px` : '0px',
    leftPanelVisible ? '10px' : '0px',
    'minmax(0, 1fr)',
    rightPanelVisible ? '10px' : '0px',
    rightPanelVisible ? `${panelLayout.rightWidth}px` : '0px',
  ].join(' ');

  const workspaceSplitTemplate = `${panelLayout.latexWidth}px 10px minmax(0, 1fr)`;

  const handleToggleClass = (className) => {
    toggleClass(className);
  };
  const handleCompileClick = () => {
    handleCompileOnly(getSelectedFormulasList());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await onSave({
      title,
      content,
      columns,
      fontSize,
      spacing,
      margins,
      selectedFormulas: getSelectedFormulasList(),
    });
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear everything? This cannot be undone.')) {
      clearLatex();
      clearSelections();
      onReset?.();
    }
  };

  return (
    <>
      <div className="app-shell">

       <div className="app-body" style={{ gridTemplateColumns: appBodyGridTemplate }}>

          {/* ══ LEFT PANEL ══ */}
          {leftPanelVisible && (
          <aside className="left-panel">
            <div className="left-panel-scroll">

              <div className="form-group left-panel-title-group">
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
                toggleClass={handleToggleClass}
                toggleCategory={toggleCategory}
                selectedCount={selectedCount}
                hasSelectedClasses={hasSelectedClasses}
                onReorderClass={reorderClass}
                onReorderFormula={reorderFormula}
                onRemoveClass={removeClassFromOrder}
                onRemoveFormula={removeSingleFormula}
              />

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

            </div>

            {/* Footer buttons */}
            <div className="left-panel-footer">
              <button
                type="button"
                onClick={handleCompileClick}
                className="btn-compile"
                disabled={isCompiling}
              >
                {isCompiling ? 'Compiling…' : 'Compile PDF'}
              </button>

              <div className="button-row">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={!canGoBack}
                  className="btn history-btn"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goForward}
                  disabled={!canGoForward}
                  className="btn history-btn"
                >
                  Forward
                </button>
              </div>

              {pdfBlob && (
                <div className="btn-download-row">
                  <button type="button" onClick={handleDownloadPDF} className="btn-dl">PDF</button>
                  <button type="button" onClick={handleDownloadTex} className="btn-dl">.tex</button>
                </div>
              )}

              <div className="button-row">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn history-btn"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn clear"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>
)}
          {leftPanelVisible ? (
            <button
              type="button"
              className="panel-resizer panel-resizer-vertical"
              onPointerDown={startResize('left')}
              aria-label="Resize subject panel"
            />
          ) : (
            <div className="panel-resizer-slot" aria-hidden="true" />
          )}
          {/* ══ CENTER PANEL — PDF main focus ══ */}
          <main className="center-panel">
            <div className="workspace-topbar">
              <div className="workspace-topbar-group">
                <button
                  type="button"
                  className="btn-toggle-panel"
                  onClick={() => setLeftPanelVisible(v => !v)}
                  title={leftPanelVisible ? 'Hide subjects' : 'Show subjects'}
                >
                  {leftPanelVisible ? 'Hide subjects' : 'Show subjects'}
                </button>
              </div>

              <div className="workspace-topbar-group workspace-topbar-group-end">
                {content && (
                  <button
                    type="button"
                    className="btn-toggle-latex"
                    onClick={() => setShowLatex(v => !v)}
                  >
                    {showLatex ? 'Hide LaTeX' : 'Show LaTeX'}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-toggle-panel"
                  onClick={() => setRightPanelVisible(v => !v)}
                  title={rightPanelVisible ? 'Hide videos' : 'Show videos'}
                >
                  {rightPanelVisible ? 'Hide videos' : 'Show videos'}
                </button>
              </div>
            </div>

             <div className="pdf-container">
               {showLatex ? (
                 <div className="workspace-split" style={{ gridTemplateColumns: workspaceSplitTemplate }}>
                   <div className="workspace-split-pane workspace-split-pane-latex">
                     <LatexEditor
                       content={content}
                       onChange={handleContentChange}
                       isModified={contentModified || hasLayoutChanges}
                       compileError={compileError}
                     />
                   </div>
                   <button
                     type="button"
                     className="panel-resizer panel-resizer-vertical panel-resizer-inner"
                     onPointerDown={startResize('latex')}
                     aria-label="Resize LaTeX panel"
                   />
                   <div className="workspace-split-pane workspace-split-pane-preview">
                     {pdfBlob || compileError ? (
                       <PdfPreview pdfBlob={pdfBlob} compileError={compileError} />
                     ) : (
                       <div className="pdf-placeholder">
                         <span>📄</span>
                         <p>Select a subject, pick categories, then compile</p>
                         <p>Your PDF will appear here</p>
                         <p>Compile will generate the first draft if the editor is still empty.</p>
                       </div>
                     )}
                   </div>
                 </div>
               ) : (
                 <>
                   {pdfBlob || compileError ? (
                     <PdfPreview pdfBlob={pdfBlob} compileError={compileError} />
                   ) : (
                     <div className="pdf-placeholder">
                       <span>📄</span>
                       <p>Select a subject, pick categories, then compile</p>
                       <p>Your PDF will appear here</p>
                       <p>Compile will generate the first draft if the editor is still empty.</p>
                     </div>
                   )}
                 </>
               )}
             </div>
          </main>
          {rightPanelVisible ? (
            <button
              type="button"
              className="panel-resizer panel-resizer-vertical"
              onPointerDown={startResize('right')}
              aria-label="Resize video panel"
            />
          ) : (
            <div className="panel-resizer-slot" aria-hidden="true" />
          )}

          {/* ══ RIGHT PANEL — YouTube resources ══ */}
          {rightPanelVisible && (
          <aside className="right-panel">
            <div className="right-panel-header">
              📺 Check Out These Resources!
            </div>
            <div className="right-panel-scroll">
              { Object.keys(selectedClasses).filter(cls => selectedClasses[cls]).length == 0 && (
                <p className="right-panel-empty">Select a subject to see related videos!</p>
              )}
              {Object.keys(selectedClasses)
                .filter(cls => selectedClasses[cls])
                .map(cls => {
                  const videos = SUBJECT_VIDEOS[cls] || [];
                  return (
                    <div key={cls} className="subject-video-group">
                      <div className="subject-video-label">{cls}</div>
                      {videos.length == 0 ? (
                        <p className="right-panel-empty right-panel-empty-subtle">
                          No videos added yet.
                        </p>
                      ) : (
                        videos.map((v) => (
                          <div 
                            key={v.videoId}
                            className="video-card-sm"
                            onClick={() => setModalVideo(v)}
                          >
                            <div className="video-thumb-sm">
                              <img src={getThumbnail(v.videoId)} alt={v.title} loading = "lazy" />
                              <div className="play-icon">▶</div>
                            </div>
                            <div className="video-info-sm">
                              <div className="v-title">{v.title}</div>
                              <div className="v-channel">{v.channel}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
          </aside>
          )}

        </div>
      </div>

      {/* ══ VIDEO MODAL ══ */}
      {modalVideo && (
        <div className="modal-overlay" onClick={() => setModalVideo(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalVideo(null)}>✕</button>
            <h4>{modalVideo.title}</h4>
            <iframe
              width="100%"
              height="400"
              src={getEmbedUrl(modalVideo.videoId)}
              title={modalVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="modal-meta">{modalVideo.channel} · {modalVideo.topic || 'General review'}</div>
            <a
              className="modal-link"
              href={getWatchUrl(modalVideo.videoId)}
              target="_blank"
              rel="noreferrer"
            >
              Open on YouTube
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCheatSheet;

import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { StreamLanguage } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { stex } from '@codemirror/legacy-modes/mode/stex';

const LATEX_LANGUAGE_EXTENSIONS = [
  StreamLanguage.define(stex),
  EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: 'var(--input-bg)',
      color: 'var(--input-text)',
    },
    '.cm-editor': {
      height: '100%',
      backgroundColor: 'var(--input-bg)',
      color: 'var(--input-text)',
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: '13px',
      lineHeight: '1.6',
    },
    '.cm-content': {
      caretColor: 'var(--input-text)',
      padding: 'var(--space-md)',
      minHeight: '100%',
    },
    '.cm-line': {
      padding: '0',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--box-bg)',
      color: 'var(--text-muted)',
      borderRight: '1px solid var(--border)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--code-modified-bg)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(59, 130, 246, 0.06)',
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(59, 130, 246, 0.28)',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  }),
];

export default function LatexCodeMirrorEditor({ value, onChange, isModified, placeholder, labelId }) {
  const extensions = useMemo(() => [
    ...LATEX_LANGUAGE_EXTENSIONS,
    EditorView.contentAttributes.of({
      'aria-labelledby': labelId,
      spellcheck: 'false',
    }),
  ], [labelId]);

  return (
    <CodeMirror
      value={value}
      height="100%"
      className={`latex-codemirror ${isModified ? 'modified' : ''}`}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
      }}
      extensions={extensions}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

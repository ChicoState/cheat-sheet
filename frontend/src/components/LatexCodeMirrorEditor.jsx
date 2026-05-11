import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { tags } from '@lezer/highlight';

export const TOKYO_NIGHT_COLORS = {
  background: '#1a1b26',
  backgroundRaised: '#24283b',
  foreground: '#c0caf5',
  muted: '#565f89',
  gutter: '#7aa2f7',
  command: '#7aa2f7',
  math: '#bb9af7',
  symbol: '#89ddff',
  string: '#9ece6a',
  warning: '#e0af68',
  selection: 'rgba(122, 162, 247, 0.28)',
  activeLine: 'rgba(122, 162, 247, 0.08)',
};

const TOKYO_NIGHT_LATEX_HIGHLIGHT_STYLE = HighlightStyle.define([
  { tag: [tags.keyword, tags.atom, tags.processingInstruction, tags.special(tags.variableName)], color: TOKYO_NIGHT_COLORS.command },
  { tag: [tags.variableName, tags.typeName, tags.className, tags.definition(tags.variableName)], color: TOKYO_NIGHT_COLORS.foreground },
  { tag: [tags.string, tags.regexp, tags.escape], color: TOKYO_NIGHT_COLORS.string },
  { tag: [tags.number, tags.bool, tags.null], color: TOKYO_NIGHT_COLORS.warning },
  { tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator, tags.logicOperator], color: TOKYO_NIGHT_COLORS.symbol },
  { tag: [tags.brace, tags.squareBracket, tags.paren, tags.punctuation, tags.separator], color: TOKYO_NIGHT_COLORS.symbol },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: TOKYO_NIGHT_COLORS.muted, fontStyle: 'italic' },
  { tag: [tags.heading, tags.strong], color: TOKYO_NIGHT_COLORS.math },
  { tag: [tags.link, tags.emphasis], color: TOKYO_NIGHT_COLORS.symbol },
]);

const LATEX_LANGUAGE_EXTENSIONS = [
  StreamLanguage.define(stex),
  syntaxHighlighting(TOKYO_NIGHT_LATEX_HIGHLIGHT_STYLE),
  EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: TOKYO_NIGHT_COLORS.background,
      color: TOKYO_NIGHT_COLORS.foreground,
    },
    '.cm-editor': {
      height: '100%',
      backgroundColor: TOKYO_NIGHT_COLORS.background,
      color: TOKYO_NIGHT_COLORS.foreground,
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: '13px',
      lineHeight: '1.6',
    },
    '.cm-content': {
      caretColor: TOKYO_NIGHT_COLORS.foreground,
      padding: 'var(--space-md)',
      minHeight: '100%',
    },
    '.cm-line': {
      padding: '0',
    },
    '.cm-gutters': {
      backgroundColor: TOKYO_NIGHT_COLORS.backgroundRaised,
      color: TOKYO_NIGHT_COLORS.muted,
      borderRight: `1px solid ${TOKYO_NIGHT_COLORS.backgroundRaised}`,
    },
    '.cm-activeLineGutter': {
      backgroundColor: TOKYO_NIGHT_COLORS.activeLine,
      color: TOKYO_NIGHT_COLORS.gutter,
    },
    '.cm-activeLine': {
      backgroundColor: TOKYO_NIGHT_COLORS.activeLine,
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: TOKYO_NIGHT_COLORS.selection,
    },
    '.cm-placeholder': {
      color: TOKYO_NIGHT_COLORS.muted,
    },
    '&.cm-focused': {
      outline: 'none',
    },
  }),
];

const LATEX_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
};

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
      basicSetup={LATEX_BASIC_SETUP}
      extensions={extensions}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

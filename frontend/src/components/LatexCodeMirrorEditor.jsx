import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { tags } from '@lezer/highlight';

export const TOKYO_NIGHT_EDITOR_THEMES = {
  storm: {
    id: 'storm',
    label: 'Tokyo Night Storm',
    colors: {
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
    },
  },
  night: {
    id: 'night',
    label: 'Tokyo Night',
    colors: {
      background: '#1a1b26',
      backgroundRaised: '#16161e',
      foreground: '#a9b1d6',
      muted: '#565f89',
      gutter: '#7aa2f7',
      command: '#7aa2f7',
      math: '#bb9af7',
      symbol: '#89ddff',
      string: '#9ece6a',
      warning: '#ff9e64',
      selection: 'rgba(111, 123, 182, 0.28)',
      activeLine: 'rgba(41, 46, 66, 0.9)',
    },
  },
  light: {
    id: 'light',
    label: 'Tokyo Night Light',
    colors: {
      background: '#d5d6db',
      backgroundRaised: '#e1e2e7',
      foreground: '#343b58',
      muted: '#9699a3',
      gutter: '#34548a',
      command: '#34548a',
      math: '#5a4a78',
      symbol: '#166775',
      string: '#485e30',
      warning: '#965027',
      selection: 'rgba(52, 84, 138, 0.18)',
      activeLine: 'rgba(52, 84, 138, 0.08)',
    },
  },
};

export const DEFAULT_TOKYO_NIGHT_EDITOR_THEME_ID = 'storm';

export const TOKYO_NIGHT_EDITOR_THEME_ORDER = ['storm', 'night', 'light'];

const LATEX_LANGUAGE_EXTENSION = StreamLanguage.define(stex);

const createLatexHighlightStyle = (colors) => HighlightStyle.define([
  { tag: [tags.keyword, tags.atom, tags.processingInstruction, tags.special(tags.variableName)], color: colors.command },
  { tag: [tags.variableName, tags.typeName, tags.className, tags.definition(tags.variableName)], color: colors.foreground },
  { tag: [tags.string, tags.regexp, tags.escape], color: colors.string },
  { tag: [tags.number, tags.bool, tags.null], color: colors.warning },
  { tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator, tags.logicOperator], color: colors.symbol },
  { tag: [tags.brace, tags.squareBracket, tags.paren, tags.punctuation, tags.separator], color: colors.symbol },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: colors.muted, fontStyle: 'italic' },
  { tag: [tags.heading, tags.strong], color: colors.math },
  { tag: [tags.link, tags.emphasis], color: colors.symbol },
]);

const createEditorTheme = (colors) => EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: colors.background,
      color: colors.foreground,
    },
    '.cm-editor': {
      height: '100%',
      backgroundColor: colors.background,
      color: colors.foreground,
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: '13px',
      lineHeight: '1.6',
    },
    '.cm-content': {
      caretColor: colors.foreground,
      padding: 'var(--space-md)',
      minHeight: '100%',
    },
    '.cm-line': {
      padding: '0',
    },
    '.cm-gutters': {
      backgroundColor: colors.backgroundRaised,
      color: colors.muted,
      borderRight: `1px solid ${colors.backgroundRaised}`,
    },
    '.cm-activeLineGutter': {
      backgroundColor: colors.activeLine,
      color: colors.gutter,
    },
    '.cm-activeLine': {
      backgroundColor: colors.activeLine,
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: colors.selection,
    },
    '.cm-placeholder': {
      color: colors.muted,
    },
    '&.cm-focused': {
      outline: 'none',
    },
  });

const LATEX_THEME_EXTENSION_CACHE = Object.fromEntries(
  Object.entries(TOKYO_NIGHT_EDITOR_THEMES).map(([themeId, theme]) => [
    themeId,
    [
      LATEX_LANGUAGE_EXTENSION,
      syntaxHighlighting(createLatexHighlightStyle(theme.colors)),
      createEditorTheme(theme.colors),
    ],
  ]),
);

const LATEX_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
};

export default function LatexCodeMirrorEditor({
  value,
  onChange,
  isModified,
  placeholder,
  labelId,
  editorThemeId = DEFAULT_TOKYO_NIGHT_EDITOR_THEME_ID,
}) {
  const resolvedThemeId = TOKYO_NIGHT_EDITOR_THEMES[editorThemeId]
    ? editorThemeId
    : DEFAULT_TOKYO_NIGHT_EDITOR_THEME_ID;
  const extensions = useMemo(() => [
    ...LATEX_THEME_EXTENSION_CACHE[resolvedThemeId],
    EditorView.contentAttributes.of({
      'aria-labelledby': labelId,
      spellcheck: 'false',
    }),
  ], [labelId, resolvedThemeId]);

  return (
    <CodeMirror
      value={value}
      height="100%"
      className={`latex-codemirror latex-codemirror-theme-${resolvedThemeId} ${isModified ? 'modified' : ''}`}
      basicSetup={LATEX_BASIC_SETUP}
      extensions={extensions}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

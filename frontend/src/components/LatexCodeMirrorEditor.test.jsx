import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LatexCodeMirrorEditor, { TOKYO_NIGHT_EDITOR_THEMES } from './LatexCodeMirrorEditor';

const { codeMirrorSpy } = vi.hoisted(() => ({
  codeMirrorSpy: vi.fn(),
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: (props) => {
    codeMirrorSpy(props);
    return <div data-testid="mock-codemirror" />;
  },
}));

describe('LatexCodeMirrorEditor', () => {
  it('uses Tokyo Night Storm as the default LaTeX editor palette', () => {
    render(
      <LatexCodeMirrorEditor
        value="\\alpha"
        onChange={vi.fn()}
        isModified={false}
        placeholder="Write LaTeX"
        labelId="latex-editor-label"
      />,
    );

    expect(TOKYO_NIGHT_EDITOR_THEMES.storm.colors).toMatchObject({
      background: '#1a1b26',
      foreground: '#c0caf5',
      muted: '#565f89',
      command: '#7aa2f7',
      math: '#bb9af7',
      symbol: '#89ddff',
      string: '#9ece6a',
    });
    expect(codeMirrorSpy).toHaveBeenCalledWith(expect.objectContaining({
      className: 'latex-codemirror latex-codemirror-theme-storm ',
      extensions: expect.any(Array),
    }));
  });

  it('can switch the LaTeX editor to Tokyo Night Light without changing app theme state', () => {
    render(
      <LatexCodeMirrorEditor
        value="\\alpha"
        onChange={vi.fn()}
        isModified={false}
        placeholder="Write LaTeX"
        labelId="latex-editor-label"
        editorThemeId="light"
      />,
    );

    expect(TOKYO_NIGHT_EDITOR_THEMES.light.colors).toMatchObject({
      background: '#d5d6db',
      foreground: '#343b58',
      command: '#34548a',
      math: '#5a4a78',
      string: '#485e30',
    });
    expect(codeMirrorSpy).toHaveBeenLastCalledWith(expect.objectContaining({
      className: 'latex-codemirror latex-codemirror-theme-light ',
    }));
  });
});

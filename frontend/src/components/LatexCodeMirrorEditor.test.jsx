import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LatexCodeMirrorEditor, { TOKYO_NIGHT_COLORS } from './LatexCodeMirrorEditor';

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
  it('uses a mellow Tokyo Night palette for LaTeX editing', () => {
    render(
      <LatexCodeMirrorEditor
        value="\\alpha"
        onChange={vi.fn()}
        isModified={false}
        placeholder="Write LaTeX"
        labelId="latex-editor-label"
      />,
    );

    expect(TOKYO_NIGHT_COLORS).toMatchObject({
      background: '#1a1b26',
      foreground: '#c0caf5',
      muted: '#565f89',
      command: '#7aa2f7',
      math: '#bb9af7',
      symbol: '#89ddff',
      string: '#9ece6a',
    });
    expect(codeMirrorSpy).toHaveBeenCalledWith(expect.objectContaining({
      className: 'latex-codemirror ',
      extensions: expect.any(Array),
    }));
  });
});

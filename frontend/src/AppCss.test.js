import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

const css = readFileSync(resolve(cwd(), 'src/App.css'), 'utf8');

function escapeSelector(selector) {
  return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRule(selector) {
  const matches = [...css.matchAll(new RegExp(String.raw`(?:^|\n)${escapeSelector(selector)}\s*\{([^}]*)\}`, 'g'))];
  if (!matches.length) throw new Error(`Missing CSS rule for ${selector}`);
  return matches.at(-1)[1];
}

function expectAnyRule(selector, pattern) {
  const matches = [...css.matchAll(new RegExp(String.raw`(?:^|\n)${escapeSelector(selector)}\s*\{([^}]*)\}`, 'g'))];
  if (!matches.length) throw new Error(`Missing CSS rule for ${selector}`);
  expect(matches.some((match) => pattern.test(match[1]))).toBe(true);
}

describe('App.css regressions', () => {
  it('contains video cards inside the sidebar width', () => {
    expectAnyRule('.right-panel', /min-width:\s*0/);
    expectAnyRule('.right-panel-scroll', /overflow-x:\s*hidden/);
    expectAnyRule('.subject-video-group', /max-width:\s*100%/);
    expectAnyRule('.section-video-picks', /max-width:\s*100%/);
    expectAnyRule('.section-video-picks.compact', /min-width:\s*0/);
    expectAnyRule('.video-card-sm', /max-width:\s*100%/);
    expectAnyRule('.video-card-sm', /min-width:\s*0/);
  });

  it('keeps sidebar focus rings visible while containing video cards', () => {
    expect(getRule('.subject-video-group')).not.toMatch(/overflow:\s*hidden/);
    expect(getRule('.section-video-picks')).not.toMatch(/overflow:\s*hidden/);
    expect(getRule('.video-card-sm:focus-visible')).toMatch(/outline-offset:\s*-2px/);
    expect(getRule('.video-more-toggle:focus-visible')).toMatch(/outline-offset:\s*0/);
  });

  it('uses a tighter row layout for compact sidebar video cards', () => {
    expect(getRule('.video-card-sm.compact')).toMatch(/display:\s*grid/);
    expect(getRule('.video-card-sm.compact')).toMatch(/grid-template-columns:\s*(72px|76px|80px|84px|88px)\s+minmax\(0,\s*1fr\)/);
    expect(getRule('.video-card-sm.compact .video-info-sm')).toMatch(/display:\s*flex/);
    expect(getRule('.video-card-sm.compact .video-info-sm')).toMatch(/flex-direction:\s*column/);
  });

  it('keeps a syntax highlight layer for the LaTeX editor', () => {
    expectAnyRule('.editor-highlight-layer', /position:\s*absolute/);
    expectAnyRule('.editor-highlight-layer', /pointer-events:\s*none/);
    expectAnyRule('.editor-highlight-layer,\n.textarea-field', /box-sizing:\s*border-box/);
    expect(getRule('.textarea-field')).toMatch(/color:\s*transparent/);
    expect(getRule('.textarea-field')).toMatch(/-webkit-text-fill-color:\s*transparent/);
    expect(getRule('.latex-token.command')).toMatch(/color:/);
  });

  it('stacks the compile shortcut hint under the button text on narrow widths', () => {
    expect(css).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.btn-compile-text\s*\{[\s\S]*flex-direction:\s*column/);
    expect(css).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.btn-compile-hint\s*\{[\s\S]*display:\s*block/);
    expect(css).toMatch(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*\.btn-compile-hint\s*\{[\s\S]*margin-left:\s*0/);
  });

  it('keeps compact video action controls flush to the left', () => {
    expect(getRule('.section-video-picks.compact .section-video-search-row')).toMatch(/display:\s*flex/);
    expect(getRule('.section-video-picks.compact .section-video-search-row')).toMatch(/justify-content:\s*flex-start/);
    expect(getRule('.section-video-picks.compact .section-video-search')).toMatch(/justify-self:\s*start/);
  });
});

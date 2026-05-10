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
});

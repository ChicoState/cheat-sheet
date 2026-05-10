import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), 'src/App.css'), 'utf8');

function escapeSelector(selector) {
  return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRule(selector) {
  const match = css.match(new RegExp(`(?:^|\\n)${escapeSelector(selector)}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing CSS rule for ${selector}`);
  return match[1];
}

describe('App.css regressions', () => {
  it('contains video cards inside the sidebar width', () => {
    expect(getRule('.right-panel')).toMatch(/min-width:\s*0/);
    expect(getRule('.right-panel-scroll')).toMatch(/overflow-x:\s*hidden/);
    expect(getRule('.subject-video-group')).toMatch(/max-width:\s*100%/);
    expect(getRule('.subject-video-group')).toMatch(/overflow:\s*hidden/);
    expect(getRule('.section-video-picks')).toMatch(/max-width:\s*100%/);
    expect(getRule('.section-video-picks.compact')).toMatch(/min-width:\s*0/);
    expect(getRule('.video-card-sm')).toMatch(/max-width:\s*100%/);
    expect(getRule('.video-card-sm')).toMatch(/min-width:\s*0/);
  });
});

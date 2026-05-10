import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';
import AuthContext from './context/AuthContext';

vi.mock('./components/CreateCheatSheet', () => ({
  default: ({ initialData, onSave, onRestoreSnapshot }) => (
    <section data-testid="create-cheat-sheet">
      <div data-testid="initial-orientation">{initialData?.orientation ?? ''}</div>
      <button
        type="button"
        onClick={() => onSave({
          title: 'Landscape Sheet',
          content: '\\section*{Landscape}',
          contentSource: 'manual',
          columns: 2,
          fontSize: '10pt',
          spacing: 'tiny',
          margins: '0.25in',
          orientation: 'landscape',
          selectedFormulas: [{ name: 'Euler' }],
        })}
      >
        Save landscape sheet
      </button>
      <button
        type="button"
        onClick={() => onRestoreSnapshot({
          title: 'Landscape Snapshot',
          content: '\\section*{Restored}',
          contentSource: 'manual',
          columns: 3,
          fontSize: '9pt',
          spacing: 'small',
          margins: '0.15in',
          orientation: 'landscape',
          selectedFormulas: [],
        })}
      >
        Restore landscape snapshot
      </button>
    </section>
  ),
}));

vi.mock('./components/Dashboard', () => ({
  default: ({ onEditSheet }) => (
    <button
      type="button"
      onClick={() => onEditSheet({
        id: 17,
        title: 'Saved Landscape Sheet',
        latex_content: '\\section*{Saved}',
        content_source: 'manual',
        columns: 2,
        margins: '0.2in',
        font_size: '10pt',
        spacing: 'tiny',
        orientation: 'landscape',
        selected_formulas: [],
      })}
    >
      Edit landscape sheet
    </button>
  ),
}));

vi.mock('./components/Login', () => ({ default: () => <div>Login</div> }));
vi.mock('./components/SignUp', () => ({ default: () => <div>Sign up</div> }));

const authValue = {
  user: { username: 'tester' },
  authTokens: { access: 'token' },
  logoutUser: vi.fn(),
};

const renderApp = (initialEntries = ['/']) => render(
  <AuthContext.Provider value={authValue}>
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  </AuthContext.Provider>,
);

describe('App sheet persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 123,
        title: 'Landscape Sheet',
        latex_content: '\\section*{Landscape}',
        content_source: 'manual',
        columns: 2,
        margins: '0.25in',
        font_size: '10pt',
        spacing: 'tiny',
        orientation: 'landscape',
        selected_formulas: [{ name: 'Euler' }],
      }),
      clone() {
        return this;
      },
    }));
  });

  it('starts new sheets with portrait orientation', () => {
    renderApp();

    expect(screen.getByTestId('initial-orientation')).toHaveTextContent('portrait');
  });

  it('persists orientation in authenticated save requests', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /save landscape sheet/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody.orientation).toBe('landscape');
  });

  it('stores the orientation returned by the save response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 123,
        title: 'Landscape Sheet',
        latex_content: '\\section*{Landscape}',
        content_source: 'manual',
        columns: 2,
        margins: '0.25in',
        font_size: '10pt',
        spacing: 'tiny',
        orientation: 'portrait',
        selected_formulas: [{ name: 'Euler' }],
      }),
      clone() {
        return this;
      },
    });

    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /save landscape sheet/i }));

    await waitFor(() => {
      const storedSheet = JSON.parse(localStorage.getItem('currentCheatSheet'));
      expect(storedSheet.orientation).toBe('portrait');
    });
  });

  it('keeps orientation when opening a saved sheet from the dashboard', async () => {
    renderApp(['/dashboard']);

    fireEvent.click(screen.getByRole('button', { name: /edit landscape sheet/i }));

    const storedSheet = JSON.parse(localStorage.getItem('currentCheatSheet'));
    expect(storedSheet.orientation).toBe('landscape');
    fireEvent.click(screen.getByRole('link', { name: /home/i }));
    await waitFor(() => expect(screen.getByTestId('initial-orientation')).toHaveTextContent('landscape'));
  });

  it('restores orientation from compile history snapshots', () => {
    localStorage.setItem('currentCheatSheet', JSON.stringify({
      title: 'Portrait Sheet',
      content: '',
      contentSource: 'empty',
      columns: 4,
      fontSize: '9pt',
      spacing: 'small',
      margins: '0.15in',
      orientation: 'portrait',
      selectedFormulas: [],
      compileHistory: [],
    }));

    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /restore landscape snapshot/i }));

    const storedSheet = JSON.parse(localStorage.getItem('currentCheatSheet'));
    expect(storedSheet.orientation).toBe('landscape');
  });
});

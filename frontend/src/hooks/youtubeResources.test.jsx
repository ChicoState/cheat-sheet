import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useYouTubeResources } from './youtubeResources';

const topic = { className: 'ALGEBRA I', category: 'Linear Equations' };
const nextTopic = { className: 'GEOMETRY', category: 'Circles' };

describe('useYouTubeResources', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('debounces the API request and stores returned resources', async () => {
    const resource = { videoId: 'abc123def45', title: 'Linear equations' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ resources: [resource] }),
    });

    const { result } = renderHook(() => useYouTubeResources({ key: 1, topics: [topic] }));

    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.resources).toEqual([resource]);
    expect(global.fetch).toHaveBeenCalledWith('/api/youtube-resources/', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ topics: [topic] }),
    }));
  });

  it('aborts an in-flight request when the search request changes', async () => {
    const signals = [];
    global.fetch.mockImplementation((_url, options) => {
      signals.push(options.signal);
      return new Promise(() => {});
    });

    const { rerender } = renderHook(
      ({ request }) => useYouTubeResources(request),
      { initialProps: { request: { key: 1, topics: [topic] } } },
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(signals[0].aborted).toBe(false);

    rerender({ request: { key: 2, topics: [nextTopic] } });

    expect(signals[0].aborted).toBe(true);
  });

  it('surfaces configured=false messaging from the backend', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ resources: [], configured: false, message: 'Missing key' }),
    });

    const { result } = renderHook(() => useYouTubeResources({ key: 1, topics: [topic] }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.error).toBe('Missing key');
  });

  it('surfaces non-OK response errors', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Quota exhausted' }),
    });

    const { result } = renderHook(() => useYouTubeResources({ key: 1, topics: [topic] }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.error).toBe('Quota exhausted');
    expect(result.current.resources).toEqual([]);
  });
});

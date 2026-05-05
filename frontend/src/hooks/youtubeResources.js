import { useEffect, useMemo, useState } from 'react';

export function useYouTubeResources(selectedTopics) {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const requestBody = useMemo(() => JSON.stringify({ topics: selectedTopics }), [selectedTopics]);

  useEffect(() => {
    if (!selectedTopics.length) {
      setResources([]);
      setIsLoading(false);
      setError('');
      return;
    }

    const controller = new window.AbortController();

    async function loadResources() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/youtube-resources/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load video suggestions.');
        }

        const nextResources = Array.isArray(data.resources) ? data.resources : [];
        setResources(nextResources);

        if (data.configured === false) {
          setError(data.message || 'Add YOUTUBE_API_KEY to enable video search.');
        } else if (!nextResources.length) {
          setError('No video matches found for the current selections yet.');
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return;
        }

        setResources([]);
        setError(fetchError.message || 'Failed to load video suggestions.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadResources();

    return () => controller.abort();
  }, [requestBody, selectedTopics]);

  return { resources, isLoading, error };
}

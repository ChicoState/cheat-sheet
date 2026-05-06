import { afterEach, describe, expect, it } from 'vitest';

import { SUBJECT_VIDEOS, getCuratedVideosForTopics, getYouTubeVideoId } from '../data/subjectVideos';

describe('subjectVideos helpers', () => {
  afterEach(() => {
    delete SUBJECT_VIDEOS['TEST CLASS'];
  });

  it('only extracts IDs from recognized YouTube hosts', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=abcdefghijk')).toBe('abcdefghijk');
    expect(getYouTubeVideoId('https://youtu.be/abcdefghijk')).toBe('abcdefghijk');
    expect(getYouTubeVideoId('https://www.youtube.com/shorts/abcdefghijk')).toBe('abcdefghijk');
    expect(getYouTubeVideoId('https://youtu.be/not-a-real-id')).toBe('');
    expect(getYouTubeVideoId('https://example.com/watch?v=abcdefghijk')).toBe('');
    expect(getYouTubeVideoId('https://not-youtu.be.example/watch?v=abcdefghijk')).toBe('');
  });

  it('shows each class-wide fallback only once across selected sections', () => {
    SUBJECT_VIDEOS['TEST CLASS'] = [
      { videoId: 'abcdefghijk', title: 'Class overview', channel: 'YouTube' },
    ];

    const videos = getCuratedVideosForTopics([
      { className: 'TEST CLASS', category: 'First Section' },
      { className: 'TEST CLASS', category: 'Second Section' },
    ]);

    expect(videos).toHaveLength(1);
    expect(videos[0]).toMatchObject({
      className: 'TEST CLASS',
      category: 'First Section',
      videoId: 'abcdefghijk',
    });
  });

  it('assigns class-wide fallback videos to sparse sections first', () => {
    SUBJECT_VIDEOS['TEST CLASS'] = [
      { videoId: 'firstfirst1', title: 'First section', channel: 'YouTube', categories: ['First Section'] },
      { videoId: 'fallback123', title: 'Class overview', channel: 'YouTube' },
    ];

    const videos = getCuratedVideosForTopics([
      { className: 'TEST CLASS', category: 'First Section' },
      { className: 'TEST CLASS', category: 'Second Section' },
    ]);

    expect(videos).toHaveLength(2);
    expect(videos[0]).toMatchObject({ category: 'First Section', videoId: 'firstfirst1' });
    expect(videos[1]).toMatchObject({ category: 'Second Section', videoId: 'fallback123' });
  });
});
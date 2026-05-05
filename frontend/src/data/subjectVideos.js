// Curated videos shown by default before the optional YouTube API search runs.
// Paste subject links here as strings, or use objects when you want better labels:
// 'ALGEBRA I': [
//   'https://www.youtube.com/watch?v=VIDEO_ID',
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Linear Equations', channel: 'Khan Academy', topic: 'Linear Equations' },
// ],
export const CURATED_SUBJECT_VIDEOS = {
  'PRE-ALGEBRA': [],
  'ALGEBRA I': [],
  'ALGEBRA II': [],
  GEOMETRY: [],
  TRIGONOMETRY: [],
  PRECALCULUS: [],
  'CALCULUS I': [],
  'CALCULUS II': [],
  'CALCULUS III': [],
  'UNIT CIRCLE': [],
  'PHYSICS I': [],
  'PHYSICS II': [],
  'STATISTICS I': [],
  'STATISTICS II': [],
};

export function getYouTubeVideoId(value = '') {
  const text = String(value).trim();
  if (!text) return '';

  if (/^[a-zA-Z0-9_-]{11}$/.test(text)) {
    return text;
  }

  try {
    const url = new URL(text);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (url.searchParams.has('v')) {
      return url.searchParams.get('v') || '';
    }

    const embedMatch = url.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
    return embedMatch?.[2] || '';
  } catch {
    return '';
  }
}

function normalizeCuratedVideo(entry, className, index) {
  const video = typeof entry === 'string' ? { url: entry } : entry;
  const videoId = video?.videoId || getYouTubeVideoId(video?.url);
  if (!videoId) return null;

  const topic = video.topic || video.category || 'Curated pick';

  return {
    className,
    category: topic,
    topic,
    title: video.title || `${className} video ${index + 1}`,
    channel: video.channel || 'YouTube',
    videoId,
    thumbnailUrl: video.thumbnailUrl || '',
    source: 'curated',
  };
}

export function getCuratedVideosForClasses(classNames) {
  const uniqueClassNames = [...new Set(classNames)];

  return uniqueClassNames.flatMap((className) => (
    (CURATED_SUBJECT_VIDEOS[className] || [])
      .map((entry, index) => normalizeCuratedVideo(entry, className, index))
      .filter(Boolean)
  ));
}

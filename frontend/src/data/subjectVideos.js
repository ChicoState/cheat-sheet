// Curated videos shown by default before the optional YouTube API search runs.
// Paste subject links here as strings, or use objects when you want better labels:
// 'ALGEBRA I': [
//   'https://www.youtube.com/watch?v=VIDEO_ID',
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Linear Equations', channel: 'Khan Academy', category: 'Linear Equations' },
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Algebra Review', channel: 'Khan Academy' }, // class-wide fallback
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

const normalizeTopic = (value = '') => String(value || '').trim().toLowerCase();

function normalizeCuratedVideo(entry, className, index, selectedCategory = '') {
  const video = typeof entry === 'string' ? { url: entry } : entry;
  const videoId = video?.videoId || getYouTubeVideoId(video?.url);
  if (!videoId) return null;

  const explicitTopic = video.category || video.topic || '';
  if (selectedCategory && explicitTopic && normalizeTopic(explicitTopic) !== normalizeTopic(selectedCategory)) {
    return null;
  }

  const topic = explicitTopic || selectedCategory || 'Curated pick';

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

export function getCuratedVideosForTopics(topics) {
  const seenTopics = new Set();

  return topics.flatMap(({ className, category }) => {
    const topicKey = `${className}:${category}`;
    if (seenTopics.has(topicKey)) return [];
    seenTopics.add(topicKey);

    return (CURATED_SUBJECT_VIDEOS[className] || [])
      .map((entry, index) => normalizeCuratedVideo(entry, className, index, category))
      .filter(Boolean);
  });
}

// Curated videos shown by default before the optional YouTube API search runs.
// Paste subject links here as strings, or use objects when you want better labels:
// 'ALGEBRA I': [
//   'https://www.youtube.com/watch?v=VIDEO_ID',
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Linear Equations', channel: 'Khan Academy', category: 'Linear Equations' },
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Algebra Review', channel: 'Khan Academy' }, // class-wide fallback
// ],
export const CURATED_SUBJECT_VIDEOS = {
  'PRE-ALGEBRA': [
    {
      url: 'https://www.youtube.com/watch?v=0wCGc90qhvg',
      title: 'Fractions Made EASY!',
      channel: 'TabletClass Math',
      categories: ['Fractions, Ratios, and Proportions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=GvLIEiqxS6s',
      title: 'Fractions Basic Introduction',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Fractions, Ratios, and Proportions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=sHTFUo3xRWQ',
      title: 'Algebra Basics: Solving Basic Equations Part 2',
      channel: 'mathantics',
      categories: ['Solving Equations'],
    },
  ],
  'ALGEBRA I': [
    {
      url: 'https://www.youtube.com/watch?v=Tx6ZpJ8fv1A',
      title: 'Linear Equations - Algebra',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Linear Equations'],
    },
    {
      url: 'https://www.youtube.com/watch?v=IWigvJcCAJ0',
      title: 'Introduction to the quadratic equation',
      channel: 'Khan Academy',
      categories: ['Quadratic Equations'],
    },
    {
      url: 'https://www.youtube.com/watch?v=M4LallQS0GA',
      title: 'Solve 2 to the x = 9, what is x?',
      channel: 'TabletClass Math',
      categories: ['Exponents'],
    },
  ],
  'ALGEBRA II': [
    {
      url: 'https://www.youtube.com/watch?v=SmutsiPnWuc',
      title: 'Graphing Logarithmic Functions',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Logarithms'],
    },
    {
      url: 'https://www.youtube.com/watch?v=xt4IMWznDuc',
      title: 'Logarithms | Algebra II',
      channel: 'Khan Academy',
      categories: ['Logarithms'],
    },
    {
      url: 'https://www.youtube.com/watch?v=NRB6s77nx2g',
      title: 'Domain and Range Functions & Graphs',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Exponential Functions'],
    },
  ],
  GEOMETRY: [
    {
      url: 'https://www.youtube.com/watch?v=Bq1QyT-HZrU',
      title: 'ANGLE THEOREMS - Top 10 Must Know',
      channel: 'JensenMath',
      categories: ['Basic Angle Relationships', 'Parallel Lines and Transversals', 'Triangles', 'Circle Theorems'],
    },
    {
      url: 'https://www.youtube.com/watch?v=dA94zyaLuhk',
      title: 'Types of Angles and Angle Relationships',
      channel: 'Professor Dave Explains',
      categories: ['Basic Angle Relationships', 'Parallel Lines and Transversals'],
    },
    {
      url: 'https://www.youtube.com/watch?v=YIqZmNYeC5M',
      title: 'Circles: radius, diameter, circumference and Pi',
      channel: 'Khan Academy',
      categories: ['Circles', 'Circle Theorems'],
    },
  ],
  TRIGONOMETRY: [
    {
      url: 'https://www.youtube.com/watch?v=FuBZlvOUxYE',
      title: 'Trigonometry For Beginners!',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Special Triangles and Basic Trig Relationships', 'Applications'],
    },
    {
      url: 'https://www.youtube.com/watch?v=Jsiy4TxgIME',
      title: 'Basic trigonometry',
      channel: 'Khan Academy',
      categories: ['Special Triangles and Basic Trig Relationships'],
    },
    {
      url: 'https://www.youtube.com/watch?v=qlItePRGLE4',
      title: 'All of TRIGONOMETRY in 36 minutes!',
      channel: 'JensenMath',
    },
  ],
  PRECALCULUS: [
    {
      url: 'https://www.youtube.com/watch?v=mgMYdo4f0XE',
      title: 'Polar Coordinates Basic Introduction',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Polar & Complex Polar'],
    },
    {
      url: 'https://www.youtube.com/watch?v=LlFbHDQVRk4',
      title: 'Verifying Trigonometric Identities',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Functions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=_svU1SgdHpw',
      title: 'Basic Trig Identities Involving Sin, Cos, and Tan',
      channel: 'Math and Science',
      categories: ['Functions'],
    },
  ],
  'CALCULUS I': [
    {
      url: 'https://www.youtube.com/watch?v=n3xBZIvgZhc',
      title: 'Calculus Made EASY! Finally Understand It in Minutes!',
      channel: 'TabletClass Math',
    },
    {
      url: 'https://www.youtube.com/watch?v=DvTQ7h6-m5I',
      title: 'Calculus Explained Like You Are 5 Years Old',
      channel: 'No Fluff Academy',
    },
    {
      url: 'https://www.youtube.com/watch?v=ZjbDmy7RO6E',
      title: 'Optimization Problems - Calculus',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Derivative Definitions and Rules', 'Common Derivatives', 'Core Theorems of Calculus'],
    },
  ],
  'CALCULUS II': [
    {
      url: 'https://www.youtube.com/watch?v=iLEWXYPZrU8',
      title: 'Calculus 2 - Integral Test For Convergence',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Sequences & Series'],
    },
    {
      url: 'https://www.youtube.com/watch?v=av947KCWf2U',
      title: 'Ratio test | Series | AP Calculus BC',
      channel: 'Khan Academy',
      categories: ['Sequences & Series', 'Power & Taylor Series'],
    },
    {
      url: 'https://www.youtube.com/watch?v=j0wJBEZdwLs',
      title: 'But what is a Laplace Transform?',
      channel: '3Blue1Brown',
    },
  ],
  'CALCULUS III': [
    {
      url: 'https://www.youtube.com/watch?v=5-CUqogfPLY',
      title: 'Lagrange Multipliers',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Partial Derivatives and Optimization'],
    },
    {
      url: 'https://www.youtube.com/watch?v=JAf_aSIJryg',
      title: 'Partial Derivatives',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Partial Derivatives and Optimization'],
    },
    {
      url: 'https://www.youtube.com/watch?v=BJ_0FURo9RE',
      title: 'Multiple Integrals',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Multiple Integrals'],
    },
  ],
  'UNIT CIRCLE': [
    {
      url: 'https://www.youtube.com/watch?v=2hame37LsH8',
      title: "Trigonometry Concepts - Don't Memorize! Visualize!",
      channel: 'Dennis Davis',
      categories: ['UNIT CIRCLE'],
    },
    {
      url: 'https://www.youtube.com/watch?v=_svU1SgdHpw',
      title: 'Unit Circle Trigonometry - Sin Cos Tan - Radians & Degrees',
      channel: 'The Organic Chemistry Tutor',
      categories: ['UNIT CIRCLE'],
    },
    {
      url: 'https://www.youtube.com/watch?v=bVog_o1Qs80',
      title: 'Sine and Cosine - Definition & Meaning',
      channel: 'Math and Science',
      categories: ['UNIT CIRCLE'],
    },
  ],
  'PHYSICS I': [
    {
      url: 'https://www.youtube.com/watch?v=40sww1q5_hc',
      title: 'Momentum and Impulse',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Momentum & Collisions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=ItiltERfe-A',
      title: 'The Most Misunderstood Concept in Physics',
      channel: 'Veritasium',
      categories: ['Work, Energy & Power'],
    },
    {
      url: 'https://www.youtube.com/watch?v=f3jhbui5Cqs',
      title: 'What ACTUALLY Happens at the Planck Length?',
      channel: 'Physics Explained',
    },
  ],
  'PHYSICS II': [
    {
      url: 'https://www.youtube.com/watch?v=U2xGyC-T_io',
      title: 'The Biggest Misconception About Electricity',
      channel: 'Veritasium',
      categories: ['Electrostatics', 'Circuits'],
    },
    {
      url: 'https://www.youtube.com/watch?v=lzF3DJw_GDc',
      title: 'Electrostatics',
      channel: 'YaleCourses',
      categories: ['Electrostatics'],
    },
    {
      url: 'https://www.youtube.com/watch?v=b9-RpGUSRe8',
      title: "Faraday's & Lenz's Law of Electromagnetic Induction",
      channel: 'The Organic Chemistry Tutor',
      categories: ['Magnetism'],
    },
  ],
  'STATISTICS I': [
    {
      url: 'https://www.youtube.com/watch?v=uzkc-qNVoOk',
      title: 'Descriptive Statistics',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Descriptive Statistics'],
    },
    {
      url: 'https://www.youtube.com/watch?v=y2G03Lumhe0',
      title: 'Probability Distributions',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Probability', 'Distributions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=mLE-SlOZToc',
      title: 'Finding probability example 2',
      channel: 'Khan Academy',
      categories: ['Probability'],
    },
  ],
  'STATISTICS II': [
    {
      url: 'https://www.youtube.com/watch?v=wiYJWyfdGg4',
      title: 'Hypothesis Testing',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Two-Sample Inference', 'Chi-Square Tests', 'ANOVA (Analysis of Variance)'],
    },
    {
      url: 'https://www.youtube.com/watch?v=VHYOuWu9jQI',
      title: 'Inferential Statistics',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Two-Sample Inference', 'Chi-Square Tests', 'ANOVA (Analysis of Variance)'],
    },
    {
      url: 'https://www.youtube.com/watch?v=P8hT5nDai6A',
      title: 'Regression Analysis',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Linear Regression'],
    },
  ],
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

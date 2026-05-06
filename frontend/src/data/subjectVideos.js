// Curated videos shown by default before the optional YouTube API search runs.
// Paste subject links here as strings, or use objects when you want better labels:
// 'ALGEBRA I': [
//   'https://www.youtube.com/watch?v=VIDEO_ID',
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Linear Equations', channel: 'Khan Academy', categories: ['Linear Equations'] },
//   { url: 'https://youtu.be/VIDEO_ID', title: 'Algebra Review', channel: 'Khan Academy' }, // class-wide fallback
// ],
export const CURATED_SUBJECT_VIDEOS = {
  'PRE-ALGEBRA': [
    {
      videoId: 'dAgfnK528RA',
      title: 'Order of Operations (PEMDAS)',
      channel: 'Khan Academy',
      categories: ['Operations and Properties'],
    },
    {
      url: 'https://www.youtube.com/watch?v=5hG8e9jGeaA',
      title: 'Fractions and Basic Equations Review',
      channel: 'YouTube',
      categories: ['Fractions, Ratios, and Proportions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=SC2WMzopxh8',
      title: 'Fractions Practice',
      channel: 'YouTube',
      categories: ['Fractions, Ratios, and Proportions'],
    },
    {
      url: 'https://www.youtube.com/watch?v=sHTFUo3xRWQ',
      title: 'Algebra Basics: Solving Basic Equations Part 2',
      channel: 'mathantics',
      categories: ['Solving Equations'],
    },
    {
      videoId: 'gtMKsFXjLHw',
      title: 'Area and Perimeter',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Area and Perimeter'],
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
    { videoId: 'uBxs7cSgOes', title: 'Solving Algebraic Inequalities', channel: 'Professor Dave Explains', categories: ['Inequalities'] },
    { videoId: 'jVvvUiExjes', title: 'Adding and Subtracting Integers', channel: 'The Organic Chemistry Tutor', categories: ['Integer Rules'] },
    { videoId: '-Xt4UDk7Kzw', title: 'Fractions, Decimals, and Percentages', channel: 'Professor Dave Explains', categories: ['Decimals and Percents'] },
    { videoId: 'B1HEzNTGeZ4', title: 'Mean, Median, and Mode', channel: 'mathantics', categories: ['Mean, Median, Mode'] },
    { videoId: 'ZvL9aDGNHqA', title: 'Polynomials', channel: 'The Organic Chemistry Tutor', categories: ['Polynomials'] },
    { videoId: 'Llrngdh3Rrg', title: 'Simplifying Radicals', channel: 'The Organic Chemistry Tutor', categories: ['Radicals'] },
    { videoId: '52tpYl2tTqk', title: 'What Are Functions?', channel: 'mathantics', categories: ['Functions'] },
    { videoId: '_cHbhzQVd7Y', title: 'Absolute Value Equations', channel: 'The Organic Chemistry Tutor', categories: ['Absolute Value'] },
    { videoId: '0Gq3uw2p6fA', title: 'Rational Expressions', channel: 'The Organic Chemistry Tutor', categories: ['Rational Expressions'] },
  ],
  'ALGEBRA II': [
    { videoId: 'SP-YJe7Vldo', title: 'Complex Numbers', channel: 'Khan Academy', categories: ['Complex Numbers'] },
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
    { videoId: 's19dWIHficY', title: 'Binomial Theorem Expansion', channel: 'The Organic Chemistry Tutor', categories: ['Polynomial Theorems and Binomial Expansion'] },
    { videoId: 'PLrgwD9TleU', title: 'Conic Sections', channel: 'The Organic Chemistry Tutor', categories: ['Conic Sections'] },
    { videoId: 'Tj89FA-d0f8', title: 'Sequences and Series', channel: "Mario's Math Tutoring", categories: ['Sequences and Series'] },
  ],
  GEOMETRY: [
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
    {
      url: 'https://www.youtube.com/watch?v=R2J3o9z7n9k',
      title: 'Angle Theorems and Circles',
      channel: 'YouTube',
      categories: ['Basic Angle Relationships', 'Triangles', 'Circles', 'Circle Theorems'],
    },
    {
      videoId: '302sBERMVwY',
      title: 'Geometry Introduction',
      channel: 'Professor Leonard',
      categories: ['Pythagorean Theorem', 'Similar and Congruent Triangles', 'Quadrilaterals', 'Polygons', 'Coordinate Geometry', 'Surface Area and Volume', 'Transformations'],
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
      url: 'https://www.youtube.com/watch?v=qlItePRGLE4',
      title: 'All of TRIGONOMETRY in 36 minutes!',
      channel: 'JensenMath',
      categories: ['Special Triangles and Basic Trig Relationships', 'Fundamental Identities'],
    },
    {
      url: 'https://www.youtube.com/watch?v=PUB0TaZ7bhA',
      title: 'Right-Triangle Trig and Identities',
      channel: 'YouTube',
      categories: ['Fundamental Identities', 'Angle Sum and Multiple-Angle Identities', 'Product and Power Identities', 'Inverse Trig Identities', 'Applications'],
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
    { videoId: 'eI4an8aSsgw', title: 'Full Precalculus Course', channel: 'Professor Leonard', categories: ['Conic Sections', 'Sequences, Series, and Binomial Theorem'] },
  ],
  'CALCULUS I': [
    {
      url: 'https://www.youtube.com/watch?v=n3xBZIvgZhc',
      title: 'Calculus Made EASY! Finally Understand It in Minutes!',
      channel: 'TabletClass Math',
    },
    {
      url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
      title: 'The Essence of Calculus',
      channel: '3Blue1Brown',
      categories: ['Limits', 'Derivative Definitions and Rules', 'Core Theorems of Calculus'],
    },
    {
      url: 'https://www.youtube.com/watch?v=ZjbDmy7RO6E',
      title: 'Optimization Problems - Calculus',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Derivative Definitions and Rules', 'Common Derivatives', 'Core Theorems of Calculus'],
    },
    { videoId: '5yfh5cf4-0w', title: 'Calculus 1 Full Course', channel: 'Professor Leonard', categories: ['Basic Antiderivatives'] },
  ],
  'CALCULUS II': [
    {
      url: 'https://www.youtube.com/watch?v=iLEWXYPZrU8',
      title: 'Calculus 2 - Integral Test For Convergence',
      channel: 'The Organic Chemistry Tutor',
      categories: ['Sequences & Series'],
    },
    {
      url: 'https://www.youtube.com/watch?v=fYyARMqiaag',
      title: 'Series and Convergence',
      channel: 'YouTube',
      categories: ['Sequences & Series', 'Power & Taylor Series'],
    },
    {
      url: 'https://www.youtube.com/watch?v=8d8wJqk1W0E',
      title: 'Series Practice',
      channel: 'YouTube',
      categories: ['Sequences & Series', 'Power & Taylor Series'],
    },
    { videoId: 'H9eCT6f_Ftw', title: 'Calculus 2 Full Course', channel: 'Professor Leonard', categories: ['Integration Techniques and Improper Integrals', 'Applications of Integration', 'Parametric & Polar'] },
  ],
  'CALCULUS III': [
    {
      url: 'https://www.youtube.com/watch?v=iVMDEPc2YQw',
      title: 'Multivariable Calculus',
      channel: 'YouTube',
      categories: ['Vector Formulas'],
    },
    {
      url: 'https://www.youtube.com/watch?v=TrcCbdWwCBc',
      title: 'Partial Derivatives and Optimization',
      channel: 'YouTube',
      categories: ['Partial Derivatives and Optimization'],
    },
    {
      url: 'https://www.youtube.com/watch?v=YQH40HgxnKg',
      title: 'Multiple Integrals',
      channel: 'YouTube',
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
      url: 'https://www.youtube.com/watch?v=DxL2HoqLbyA',
      title: 'Mechanics Review',
      channel: 'YouTube',
      categories: ['Kinematics (Motion)', 'Dynamics (Forces)', 'Work, Energy & Power'],
    },
    {
      url: 'https://www.youtube.com/watch?v=EceJQ05KTf4',
      title: 'Impulse and Momentum Practice',
      channel: 'YouTube',
      categories: ['Momentum & Collisions'],
    },
    { videoId: 'b1t41Q3xRM8', title: 'Physics 1 Final Exam Review', channel: 'The Organic Chemistry Tutor', categories: ['Electricity & Waves'] },
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
    { videoId: 'uHvs-G-njo8', title: 'Physics 2 Final Exam Review', channel: 'The Organic Chemistry Tutor', categories: ['Waves & Optics'] },
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
      url: 'https://www.youtube.com/watch?v=KZF9IBm9C6E',
      title: 'Probability Practice',
      channel: 'YouTube',
      categories: ['Probability'],
    },
    { videoId: 'xxpc-HPWX28', title: 'Statistics Exam 1 Review', channel: 'The Organic Chemistry Tutor', categories: ['Inferential Statistics'] },
  ],
  'STATISTICS II': [
    {
      url: 'https://www.youtube.com/watch?v=0oc49DyA3hU',
      title: 'Hypothesis Testing',
      channel: 'YouTube',
      categories: ['Two-Sample Inference', 'Chi-Square Tests', 'ANOVA (Analysis of Variance)'],
    },
    {
      url: 'https://www.youtube.com/watch?v=JQc3yx0-Q9E',
      title: 'Inferential Statistics',
      channel: 'YouTube',
      categories: ['Two-Sample Inference', 'Chi-Square Tests', 'ANOVA (Analysis of Variance)'],
    },
    {
      url: 'https://www.youtube.com/watch?v=PaFPbb66DxQ',
      title: 'Regression Analysis',
      channel: 'YouTube',
      categories: ['Linear Regression'],
    },
  ],
};

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const MIN_CURATED_VIDEOS_PER_SECTION = 2;

function isYouTubeHost(hostname = '') {
  return YOUTUBE_HOSTS.has(String(hostname).toLowerCase());
}

export function getYouTubeVideoId(value = '') {
  const text = String(value).trim();
  if (!text) return '';

  if (YOUTUBE_VIDEO_ID_REGEX.test(text)) {
    return text;
  }

  try {
    const url = new URL(text);
    if (!isYouTubeHost(url.hostname)) {
      return '';
    }

    if (url.hostname.toLowerCase() === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0] || '';
      return YOUTUBE_VIDEO_ID_REGEX.test(videoId) ? videoId : '';
    }

    if (url.searchParams.has('v')) {
      const videoId = url.searchParams.get('v') || '';
      return YOUTUBE_VIDEO_ID_REGEX.test(videoId) ? videoId : '';
    }

    const embedMatch = url.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
    return embedMatch?.[2] || '';
  } catch {
    return '';
  }
}

const normalizeTopic = (value = '') => String(value || '').trim().toLowerCase();

const getCategoryTargets = (video = {}) => {
  if (Array.isArray(video.categories)) {
    return video.categories.filter(Boolean);
  }

  return [];
};

function normalizeCuratedVideo(entry, className, index, selectedCategory = '') {
  const video = typeof entry === 'string' ? { url: entry } : entry;
  const videoId = video?.videoId || getYouTubeVideoId(video?.url);
  if (!videoId) return null;

  const explicitTopic = video.category || video.topic || '';
  const categoryTargets = getCategoryTargets(video);
  let matchRank = 0;

  if (selectedCategory) {
    const normalizedSelectedCategory = normalizeTopic(selectedCategory);
    const explicitTopicMatches = explicitTopic && normalizeTopic(explicitTopic) === normalizedSelectedCategory;
    const categoryTargetMatches = categoryTargets.some((category) => normalizeTopic(category) === normalizedSelectedCategory);
    const isClassWideFallback = !explicitTopic && categoryTargets.length === 0;

    if (!explicitTopicMatches && !categoryTargetMatches && !isClassWideFallback) {
      return null;
    }

    matchRank = isClassWideFallback ? 1 : 0;
  }

  const topic = selectedCategory || explicitTopic || categoryTargets[0] || 'Curated pick';

  return {
    className,
    category: topic,
    topic,
    title: video.title || `${className} video ${index + 1}`,
    channel: video.channel || 'YouTube',
    videoId,
    thumbnailUrl: video.thumbnailUrl || '',
    source: 'curated',
    matchRank,
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
  const seenClassWideVideos = new Set();
  const topicMatches = [];

  topics.forEach(({ className, category }, topicIndex) => {
    const topicKey = `${className}:${category}`;
    if (seenTopics.has(topicKey)) return;
    seenTopics.add(topicKey);

    const videos = (CURATED_SUBJECT_VIDEOS[className] || [])
      .map((entry, index) => normalizeCuratedVideo(entry, className, index, category))
      .filter(Boolean)
      .sort((a, b) => a.matchRank - b.matchRank);

    topicMatches.push({
      topicIndex,
      className,
      sectionSpecificVideos: videos.filter((video) => video.matchRank === 0),
      fallbackVideos: videos.filter((video) => video.matchRank === 1),
      selectedFallbackVideos: [],
    });
  });

  [...topicMatches]
    .filter(({ sectionSpecificVideos }) => sectionSpecificVideos.length < MIN_CURATED_VIDEOS_PER_SECTION)
    .sort((left, right) => left.sectionSpecificVideos.length - right.sectionSpecificVideos.length || left.topicIndex - right.topicIndex)
    .forEach((match) => {
      const neededFallbackCount = MIN_CURATED_VIDEOS_PER_SECTION - match.sectionSpecificVideos.length;
      match.selectedFallbackVideos = match.fallbackVideos.filter((video) => {
        const fallbackKey = `${match.className}:${video.videoId}`;
        if (seenClassWideVideos.has(fallbackKey)) return false;
        seenClassWideVideos.add(fallbackKey);
        return true;
      }).slice(0, neededFallbackCount);
    });

  return topicMatches
    .sort((left, right) => left.topicIndex - right.topicIndex)
    .flatMap(({ sectionSpecificVideos, selectedFallbackVideos }) => [
      ...sectionSpecificVideos,
      ...selectedFallbackVideos,
    ]);
}

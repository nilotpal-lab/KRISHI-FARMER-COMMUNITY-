import fixtures from './fixtures.json';
import placesData from './places.json';
import { IndianState, Community, Post, Comment, Report, UserProfile, Locale } from '@/types';

// Process and initialize the mock data
export function getInitialDemoAccounts(): UserProfile[] {
  return [
    {
      username: 'gowri_demo',
      displayName: 'Gowri',
      displayNames: { en: 'Gowri', kn: 'ಗೌರಿ', hi: 'गौरी' },
      avatarUrl: '/assets/farmers/gowri_avatar.jpg',
      role: 'member',
      enabled: true
    },
    {
      username: 'ravi_demo',
      displayName: 'Ravi',
      displayNames: { en: 'Ravi', kn: 'ರವಿ', hi: 'रवि' },
      avatarUrl: '/assets/farmers/ravi_avatar.jpg',
      role: 'member',
      enabled: true
    },
    {
      username: 'admin_demo',
      displayName: 'Krishi Demo Moderator',
      displayNames: { en: 'Krishi Demo Moderator', kn: 'ಕೃಷಿ ಡೆಮೊ ಮಾಡರೇಟರ್', hi: 'कृषि डेमो मॉडरेटर' },
      role: 'admin',
      enabled: true
    }
  ];
}

export function getInitialStates(): IndianState[] {
  return placesData.states as IndianState[];
}

const COMMUNITY_IMAGES: Record<string, { url: string; alt: string }> = {
  'karnataka-farmers': {
    url: '/assets/crops/paddy_mandya.jpg',
    alt: 'Lush irrigated paddy fields with stone canal in Mandya, Karnataka',
  },
  'maharashtra-farmers': {
    url: '/assets/crops/sugarcane_field.jpg',
    alt: 'Sugarcane cultivation with drip irrigation in Maharashtra',
  },
  'tamil-nadu-farmers': {
    url: '/assets/crops/millet_field.jpg',
    alt: 'Millet and grain cultivation in fertile red soil',
  },
  'tomato-growers': {
    url: '/assets/crops/tomato_crop.jpg',
    alt: 'Healthy tomato vines and ripening crop',
  },
  'chilli-growers': {
    url: '/assets/crops/chilli_crop.jpg',
    alt: 'Vibrant green chilli pepper crop in black soil',
  },
  'onion-growers': {
    url: '/assets/crops/onion_field.jpg',
    alt: 'Lush green onion nursery beds and field rows',
  },
};

export function getInitialCommunities(): Community[] {
  const baseTime = Date.now();
  return (fixtures.communities as any[]).map((c, i) => {
    const imgInfo = COMMUNITY_IMAGES[c.slug] || {
      url: '/assets/crops/paddy_mandya.jpg',
      alt: 'Community agriculture and farming network',
    };
    return {
      id: `comm_${c.slug}`,
      slug: c.slug,
      kind: c.kind,
      stateKey: c.stateKey || null,
      seedOrder: c.seedOrder || null,
      name: c.labels?.en?.name || c.slug,
      description: c.labels?.en?.description || '',
      lang: 'en' as Locale,
      createdAt: new Date(baseTime - (10 - i) * 86400000).toISOString(),
      labels: c.labels,
      imageUrl: imgInfo.url,
      imageAlt: imgInfo.alt,
    };
  });
}

export function getInitialPosts(): Post[] {
  const now = Date.now();
  return (fixtures.posts as any[]).map((p, idx) => {
    const author = p.author === 'gowri_demo' ? 'Gowri' : 'Ravi';
    const createdAt = new Date(now + (p.offsetMinutes || -(idx * 60)) * 60000).toISOString();
    
    // Choose specific high quality diagnostic image based on post content and community
    let imageUrl = '/assets/crops/paddy_mandya.jpg';
    let imageAlt = 'Field crop observation';

    const slug = p.community;
    const titleLower = (p.title || '').toLowerCase();

    if (p.key === 'p01' || titleLower.includes('cotton') || titleLower.includes('ಹತ್ತಿ') || titleLower.includes('कपास')) {
      imageUrl = '/assets/crops/cotton_crop.jpg';
      imageAlt = 'Cotton bolls and soil testing diagnostic in black cotton soil';
    } else if (slug === 'tomato-growers' || titleLower.includes('tomato') || titleLower.includes('ಟೊಮ್ಯಾಟೊ') || titleLower.includes('टमाटर')) {
      imageUrl = '/assets/crops/tomato_crop.jpg';
      imageAlt = 'Tomato plant vine and diagnostic crop observation';
    } else if (slug === 'chilli-growers' || titleLower.includes('chilli') || titleLower.includes('ಮೆಣಸಿನ') || titleLower.includes('मिर्च')) {
      imageUrl = '/assets/crops/chilli_crop.jpg';
      imageAlt = 'Chilli leaf spot identification in black soil';
    } else if (slug === 'maharashtra-farmers' || titleLower.includes('टपक') || titleLower.includes('yield') || titleLower.includes('sugarcane')) {
      imageUrl = '/assets/crops/sugarcane_field.jpg';
      imageAlt = 'Sugarcane cultivation and drip irrigation in Maharashtra';
    } else if (slug === 'onion-growers' || titleLower.includes('onion') || titleLower.includes('ಈರುಳ್ಳಿ') || titleLower.includes('प्याज़')) {
      imageUrl = '/assets/crops/onion_field.jpg';
      imageAlt = 'Onion and vegetable crop nursery stage';
    } else if (slug === 'tamil-nadu-farmers' || titleLower.includes('rainfall') || titleLower.includes('red soil') || titleLower.includes('millet')) {
      imageUrl = '/assets/crops/millet_field.jpg';
      imageAlt = 'Millet and dryland crop rows in red soil';
    } else {
      imageUrl = '/assets/crops/paddy_mandya.jpg';
      imageAlt = 'Irrigation channel and fertile farmland in Mandya';
    }

    const title = p.labels?.en?.title || p.title;
    const body = p.labels?.en?.body || p.body;

    return {
      id: `p_${p.key}`,
      key: p.key,
      communitySlug: p.community,
      authorUsername: p.author,
      authorDisplayName: author,
      title,
      body,
      lang: (p.lang || 'en') as Locale,
      state: 'published' as const,
      createdAt,
      imageUrl,
      imageAlt,
      labels: p.labels,
    };
  });
}

export function getInitialComments(): Comment[] {
  const now = Date.now();
  return (fixtures.comments as any[]).map((c, idx) => {
    const author = c.author === 'gowri_demo' ? 'Gowri' : 'Ravi';
    const createdAt = new Date(now + (c.offsetMinutes || -(idx * 30)) * 60000).toISOString();
    const body = c.labels?.en?.body || c.body;
    return {
      id: `c_${c.key}`,
      key: c.key,
      postId: `p_${c.post}`,
      authorUsername: c.author,
      authorDisplayName: author,
      body,
      lang: (c.lang || 'en') as Locale,
      createdAt,
      labels: c.labels,
    };
  });
}

export function getInitialReports(): Report[] {
  const now = Date.now();
  return (fixtures.reports as any[]).map((r, idx) => {
    const createdAt = new Date(now + (r.offsetMinutes || -(idx * 40)) * 60000).toISOString();
    const targetPost = (fixtures.posts as any[]).find((p) => p.key === r.post);
    const postTitle = targetPost?.labels?.en?.title || 'Field crop advisory post';
    return {
      id: `r_${r.key}`,
      key: r.key,
      postId: `p_${r.post}`,
      postTitle,
      reporterUsername: r.reporter,
      reason: r.reason,
      status: r.status,
      createdAt
    };
  });
}

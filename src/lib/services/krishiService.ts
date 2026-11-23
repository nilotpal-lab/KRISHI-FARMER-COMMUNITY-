import { 
  Community, 
  Post, 
  Comment, 
  Report, 
  UserProfile, 
  IndianState, 
  PaginatedResult, 
  Locale, 
  ReportReason,
  CommunityKind
} from '@/types';
import { 
  getInitialDemoAccounts, 
  getInitialCommunities, 
  getInitialPosts, 
  getInitialComments, 
  getInitialReports, 
  getInitialStates 
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'krishi_demo_current_user_v5',
  REGISTERED_USERS: 'krishi_registered_users_v5',
  COMMUNITIES: 'krishi_demo_communities_v5',
  MEMBERSHIPS: 'krishi_demo_memberships_v5',
  POSTS: 'krishi_demo_posts_v5',
  COMMENTS: 'krishi_demo_comments_v5',
  REPORTS: 'krishi_demo_reports_v5',
  UPVOTES: 'krishi_demo_upvotes_v5',
};

/**
 * Demo-grade SHA-256 password hashing via Web Crypto SubtleCrypto.
 * Note: Real production authentication replaces this later with bcrypt/Argon2 + secure server sessions.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

class MockKrishiService {
  private users: UserProfile[] = getInitialDemoAccounts();
  private states: IndianState[] = getInitialStates();
  private listeners: Set<() => void> = new Set();

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isClient()) return fallback;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
        return fallback;
      }
      return parsed;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error('Storage write error', e);
      throw e;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // --- Auth / Accounts ---
  public getCurrentUser(locale?: Locale): UserProfile | null {
    // Default to gowri_demo for rapid testing, or null for guest
    const user = this.getItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, this.users[0]);
    if (!user) return null;
    let displayName = user.displayName;
    let avatarUrl = user.avatarUrl;
    if (user.username === 'gowri_demo') {
      displayName = locale === 'kn' ? 'ಗೌರಿ' : locale === 'hi' ? 'गौरी' : 'Gowri';
      avatarUrl = '/assets/farmers/gowri_avatar.jpg';
    } else if (user.username === 'ravi_demo') {
      displayName = locale === 'kn' ? 'ರವಿ' : locale === 'hi' ? 'रवि' : 'Ravi';
      avatarUrl = '/assets/farmers/ravi_avatar.jpg';
    } else if (user.username === 'admin_demo') {
      displayName = locale === 'kn' ? 'ಕೃಷಿ ಡೆಮೊ ಮಾಡರೇಟರ್' : locale === 'hi' ? 'कृषि डेमो मॉडरेटर' : 'Krishi Demo Moderator';
    }
    return { ...user, displayName, avatarUrl };
  }

  public getAvailableAccounts(): UserProfile[] {
    return this.users;
  }

  public getRegisteredUsers(): UserProfile[] {
    return this.getItem<UserProfile[]>(STORAGE_KEYS.REGISTERED_USERS, []);
  }

  public getAllUsers(): UserProfile[] {
    return [...this.users, ...this.getRegisteredUsers()];
  }

  public async registerUser(profile: UserProfile): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    const registered = this.getRegisteredUsers();
    const cleanUsername = profile.username.trim().toLowerCase();
    
    // Check if username taken in demo users or registered users
    const allUsers = [...this.users, ...registered];
    if (allUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'auth.usernameTaken' };
    }

    try {
      registered.push(profile);
      this.setItem(STORAGE_KEYS.REGISTERED_USERS, registered);
      this.setItem(STORAGE_KEYS.CURRENT_USER, profile);
      return { success: true, user: profile };
    } catch (err: unknown) {
      if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) {
        return { success: false, error: 'error.storageQuota' };
      }
      return { success: false, error: 'common.errorDesc' };
    }
  }

  public switchAccount(username: string | null): UserProfile | null {
    if (!username) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, null);
      return null;
    }
    const all = this.getAllUsers();
    const found = all.find((u) => u.username === username);
    if (found) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, found);
      return found;
    }
    return null;
  }

  public async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'auth.invalidCredentials' };
    }

    // 1. Check demo accounts first
    const demoFound = this.users.find((u) => u.username.toLowerCase() === trimmed);
    if (demoFound) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, demoFound);
      return { success: true, user: demoFound };
    }

    // 2. Check registered accounts
    const registered = this.getRegisteredUsers();
    const userFound = registered.find((u) => u.username.toLowerCase() === trimmed);
    if (!userFound) {
      return { success: false, error: 'auth.invalidCredentials' };
    }

    const hashedInput = await hashPassword(password);
    if (userFound.passwordHash && userFound.passwordHash !== hashedInput) {
      return { success: false, error: 'auth.invalidCredentials' };
    }

    this.setItem(STORAGE_KEYS.CURRENT_USER, userFound);
    return { success: true, user: userFound };
  }

  public logout(): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, null);
  }

  // --- States ---
  public getStates(): IndianState[] {
    return this.states;
  }

  private ensureCommunityImage(c: Community): Community {
    const map: Record<string, string> = {
      'karnataka-farmers': '/assets/crops/paddy_mandya.jpg',
      'maharashtra-farmers': '/assets/crops/sugarcane_field.jpg',
      'tamil-nadu-farmers': '/assets/crops/millet_field.jpg',
      'tomato-growers': '/assets/crops/tomato_crop.jpg',
      'chilli-growers': '/assets/crops/chilli_crop.jpg',
      'onion-growers': '/assets/crops/onion_field.jpg',
    };
    if (map[c.slug]) {
      return { ...c, imageUrl: map[c.slug] };
    }
    return c.imageUrl ? c : { ...c, imageUrl: '/assets/crops/paddy_mandya.jpg' };
  }

  public getLocalizedImageAlt(slug?: string, key?: string, title?: string, locale: Locale = 'en'): string {
    const isKn = locale === 'kn';
    const isHi = locale === 'hi';
    const titleLower = (title || '').toLowerCase();

    if (key === 'p01' || titleLower.includes('cotton') || titleLower.includes('ಹತ್ತಿ') || titleLower.includes('कपास')) {
      return isKn ? 'ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಹತ್ತಿ ಕಾಯಿ ಮತ್ತು ಮಣ್ಣು ಪರೀಕ್ಷೆ ರೋಗನಿದಾನ'
        : isHi ? 'काली मिट्टी में कपास के फल और मिट्टी परीक्षण निदान'
        : 'Cotton bolls and soil testing diagnostic in black cotton soil';
    }
    if (slug === 'tomato-growers' || titleLower.includes('tomato') || titleLower.includes('ಟೊಮ್ಯಾಟೊ') || titleLower.includes('टमाटर')) {
      return isKn ? 'ಟೊಮ್ಯಾಟೊ ಬಳ್ಳಿ ಮತ್ತು ಬೆಳೆ ರೋಗನಿದಾನ ವೀಕ್ಷಣೆ'
        : isHi ? 'टमाटर की बेल और फसल निदान अवलोकन'
        : 'Tomato plant vine and diagnostic crop observation';
    }
    if (slug === 'chilli-growers' || titleLower.includes('chilli') || titleLower.includes('ಮೆಣಸಿನ') || titleLower.includes('मिर्च')) {
      return isKn ? 'ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಮೆಣಸಿನ ಎಲೆ ಕಲೆ ರೋಗ ಗುರುತಿಸುವಿಕೆ'
        : isHi ? 'काली मिट्टी में मिर्च के पत्तों के धब्बे की पहचान'
        : 'Chilli leaf spot identification in black soil';
    }
    if (slug === 'maharashtra-farmers' || titleLower.includes('टपक') || titleLower.includes('yield') || titleLower.includes('sugarcane')) {
      return isKn ? 'ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ಕಬ್ಬು ಬೆಳೆ ಮತ್ತು ಹನಿ ನೀರಾವರಿ'
        : isHi ? 'महाराष्ट्र में गन्ने की खेती और टपक सिंचाई'
        : 'Sugarcane cultivation and drip irrigation in Maharashtra';
    }
    if (slug === 'onion-growers' || titleLower.includes('onion') || titleLower.includes('ಈರುಳ್ಳಿ') || titleLower.includes('प्याज़')) {
      return isKn ? 'ಈರುಳ್ಳಿ ಮತ್ತು ತರಕಾರಿ ಸಸಿಮಡಿ ಹಂತದ ವೀಕ್ಷಣೆ'
        : isHi ? 'प्याज़ और सब्ज़ी की पौधशाला अवस्था'
        : 'Onion and vegetable crop nursery stage';
    }
    if (slug === 'tamil-nadu-farmers' || titleLower.includes('rainfall') || titleLower.includes('red soil') || titleLower.includes('millet')) {
      return isKn ? 'ಕೆಂಪು ಮಣ್ಣಿನಲ್ಲಿ ಸಿರಿಧಾನ್ಯ ಮತ್ತು ಒಣಭೂಮಿ ಬೆಳೆ ಸಾಲುಗಳು'
        : isHi ? 'लाल मिट्टी में बाजरा और शुष्क भूमि की फसल'
        : 'Millet and dryland crop rows in red soil';
    }
    return isKn ? 'ಮಂಡ್ಯದ ನೀರಾವರಿ ಕಾಲುವೆ ಮತ್ತು ಫಲವತ್ತಾದ ಕೃಷಿಭೂಮಿ'
      : isHi ? 'मांड्या में सिंचाई नहर और उपजाऊ कृषि भूमि'
      : 'Irrigation channel and fertile farmland in Mandya';
  }

  private ensurePostImage(p: Post): Post {
    let imageUrl = '/assets/crops/paddy_mandya.jpg';
    let imageAlt = 'Field crop observation';
    const slug = p.communitySlug;
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
    }

    if (p.imageUrl && !p.imageUrl.includes('sugarcane_red_rot') && !p.imageUrl.includes('brinjal-sample')) {
      return p;
    }
    return { ...p, imageUrl, imageAlt };
  }

  public localizeCommunity(c: Community, locale: Locale = 'en'): Community {
    const commWithImg = this.ensureCommunityImage(c);
    const label = c.labels?.[locale];
    if (label) {
      return {
        ...commWithImg,
        name: label.name,
        description: label.description,
        lang: locale,
        imageAlt: this.getLocalizedImageAlt(c.slug, undefined, label.name, locale),
      };
    }
    return commWithImg;
  }

  public localizePost(p: Post, locale: Locale = 'en'): Post {
    const postWithImg = this.ensurePostImage(p);

    let authorDisplayName = p.authorDisplayName;
    if (p.authorUsername === 'gowri_demo') {
      authorDisplayName = locale === 'kn' ? 'ಗೌರಿ' : locale === 'hi' ? 'गौरी' : 'Gowri';
    } else if (p.authorUsername === 'ravi_demo') {
      authorDisplayName = locale === 'kn' ? 'ರವಿ' : locale === 'hi' ? 'रवि' : 'Ravi';
    } else if (p.authorUsername === 'admin_demo') {
      authorDisplayName = locale === 'kn' ? 'ಕೃಷಿ ಡೆಮೊ ಮಾಡರೇಟರ್' : locale === 'hi' ? 'कृषि डेमो मॉडरेटर' : 'Krishi Demo Moderator';
    }

    const label = p.labels?.[locale];
    const title = label ? label.title : (p.labels?.en?.title || p.title);
    const body = label ? label.body : (p.labels?.en?.body || p.body);
    const imageAlt = this.getLocalizedImageAlt(p.communitySlug, p.key, title, locale);

    return {
      ...postWithImg,
      title,
      body,
      lang: p.lang || locale,
      labels: p.labels,
      authorDisplayName,
      imageAlt,
    };
  }

  public localizeComment(c: Comment, locale: Locale = 'en'): Comment {
    let authorDisplayName = c.authorDisplayName;
    if (c.authorUsername === 'gowri_demo') {
      authorDisplayName = locale === 'kn' ? 'ಗೌರಿ' : locale === 'hi' ? 'गौरी' : 'Gowri';
    } else if (c.authorUsername === 'ravi_demo') {
      authorDisplayName = locale === 'kn' ? 'ರವಿ' : locale === 'hi' ? 'रवि' : 'Ravi';
    } else if (c.authorUsername === 'admin_demo') {
      authorDisplayName = locale === 'kn' ? 'ಕೃಷಿ ಡೆಮೊ ಮಾಡರೇಟರ್' : locale === 'hi' ? 'कृषि डेमो मॉडरेटर' : 'Krishi Demo Moderator';
    }

    const label = c.labels?.[locale];
    const body = label ? label.body : (c.labels?.en?.body || c.body);

    return {
      ...c,
      body,
      lang: c.lang || locale,
      labels: c.labels,
      authorDisplayName,
    };
  }

  // --- Communities ---
  public getCommunities(kind?: string, page = 1, pageSize = 12, locale: Locale = 'en'): PaginatedResult<Community> {
    const all = this.getItem<Community[]>(STORAGE_KEYS.COMMUNITIES, getInitialCommunities());
    let filtered = [...all];

    if (kind && kind !== 'all') {
      filtered = filtered.filter((c) => c.kind === kind);
    }

    // Sort: seedOrder first, then createdAt descending
    filtered.sort((a, b) => {
      if (a.seedOrder && b.seedOrder) return a.seedOrder - b.seedOrder;
      if (a.seedOrder) return -1;
      if (b.seedOrder) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize).map((c) => this.localizeCommunity(c, locale));

    return {
      items,
      page,
      pageSize,
      total,
      hasOlder: startIndex + pageSize < total,
      hasNewer: page > 1,
    };
  }

  public getCommunityBySlug(slug: string, locale: Locale = 'en'): Community | null {
    const all = this.getItem<Community[]>(STORAGE_KEYS.COMMUNITIES, getInitialCommunities());
    const comm = all.find((c) => c.slug === slug);
    return comm ? this.localizeCommunity(comm, locale) : null;
  }

  public getMemberships(username?: string): string[] {
    const user = username || this.getCurrentUser()?.username;
    if (!user) return [];
    // Default memberships: Gowri and Ravi belong to the 6 seed groups
    const defaultMemberships: Record<string, string[]> = {
      gowri_demo: ['karnataka-farmers', 'tomato-growers', 'maharashtra-farmers', 'onion-growers', 'tamil-nadu-farmers', 'chilli-growers'],
      ravi_demo: ['karnataka-farmers', 'tomato-growers', 'maharashtra-farmers', 'onion-growers', 'tamil-nadu-farmers', 'chilli-growers'],
      admin_demo: []
    };
    const map = this.getItem<Record<string, string[]>>(STORAGE_KEYS.MEMBERSHIPS, defaultMemberships);
    return map[user] || [];
  }

  public setMembership(slug: string, joined: boolean): boolean {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'member') return false;

    const map = this.getItem<Record<string, string[]>>(STORAGE_KEYS.MEMBERSHIPS, {
      gowri_demo: ['karnataka-farmers', 'tomato-growers', 'maharashtra-farmers', 'onion-growers', 'tamil-nadu-farmers', 'chilli-growers'],
      ravi_demo: ['karnataka-farmers', 'tomato-growers', 'maharashtra-farmers', 'onion-growers', 'tamil-nadu-farmers', 'chilli-growers'],
      admin_demo: []
    });

    const userList = new Set(map[user.username] || []);
    if (joined) {
      userList.add(slug);
    } else {
      userList.delete(slug);
    }
    map[user.username] = Array.from(userList);
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, map);
    return true;
  }

  public createCommunity(data: {
    name: string;
    description: string;
    kind: CommunityKind;
    stateKey?: string | null;
    lang: Locale;
  }): { success: boolean; community?: Community; error?: string } {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'member') return { success: false, error: 'auth_required' };

    const nameTrimmed = data.name.trim();
    if (nameTrimmed.length < 3 || nameTrimmed.length > 60) {
      return { success: false, error: 'Name must be between 3 and 60 characters.' };
    }
    if (data.description.trim().length < 10 || data.description.trim().length > 240) {
      return { success: false, error: 'Description must be between 10 and 240 characters.' };
    }
    if (data.kind === 'location' && !data.stateKey) {
      return { success: false, error: 'Please select a state or union territory.' };
    }

    const all = this.getItem<Community[]>(STORAGE_KEYS.COMMUNITIES, getInitialCommunities());

    // Check duplicate name within same kind & state scope
    const isDup = all.some(
      (c) => c.kind === data.kind && (c.stateKey || '') === (data.stateKey || '') && c.name.toLowerCase() === nameTrimmed.toLowerCase()
    );
    if (isDup) {
      return { success: false, error: 'A community with this name already exists in this category.' };
    }

    const id = `comm_${Date.now()}`;
    const slug = `g-${Math.random().toString(36).substring(2, 9)}`;

    const newComm: Community = {
      id,
      slug,
      kind: data.kind,
      stateKey: data.kind === 'location' ? data.stateKey : null,
      name: nameTrimmed,
      description: data.description.trim(),
      lang: data.lang,
      createdAt: new Date().toISOString(),
      createdBy: user.username,
      labels: {
        [data.lang]: {
          name: nameTrimmed,
          description: data.description.trim(),
        },
      },
    };

    all.push(newComm);
    this.setItem(STORAGE_KEYS.COMMUNITIES, all);

    // Creator automatically joins the community
    this.setMembership(slug, true);

    return { success: true, community: newComm };
  }

  // --- Posts ---
  public getPosts(page = 1, pageSize = 10, communitySlug?: string, locale?: Locale): PaginatedResult<Post> {
    const all = this.getItem<Post[]>(STORAGE_KEYS.POSTS, getInitialPosts());
    let filtered = all.filter((p) => p.state === 'published');

    if (communitySlug) {
      filtered = filtered.filter((p) => p.communitySlug === communitySlug);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize).map((p) => this.localizePost(p, locale));

    return {
      items,
      page,
      pageSize,
      total,
      hasOlder: startIndex + pageSize < total,
      hasNewer: page > 1,
    };
  }

  public getPostById(id: string, locale: Locale = 'en'): Post | null {
    const all = this.getItem<Post[]>(STORAGE_KEYS.POSTS, getInitialPosts());
    const cleanId = id.toLowerCase().replace(/^post[_-]/, '');
    const padded = cleanId.length === 1 ? `0${cleanId}` : cleanId;
    const post = all.find(
      (p) =>
        p.id === id ||
        p.key === id ||
        p.id === `p_${id}` ||
        `p_${p.key}` === id ||
        p.key === `p${padded}` ||
        p.key === `p${cleanId}` ||
        p.id === `p_p${padded}` ||
        p.id === `p_p${cleanId}`
    );
    if (!post || post.state === 'hidden') return null;
    return this.localizePost(post, locale);
  }

  public publishPost(data: {
    communitySlug: string;
    title: string;
    body: string;
    lang: Locale;
    imageUrl?: string;
    imageAlt?: string;
    audioUrl?: string;
  }): { success: boolean; post?: Post; error?: string } {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'member') return { success: false, error: 'auth_required' };

    const memberships = this.getMemberships(user.username);
    if (!memberships.includes(data.communitySlug)) {
      return { success: false, error: 'form.joinToPostNotice' };
    }

    const titleTrimmed = data.title.trim();
    let bodyTrimmed = data.body.trim();

    // If audio is provided but body is brief, allow voice post
    if (data.audioUrl && !bodyTrimmed) {
      bodyTrimmed = '🎙️ Voice note';
    }

    if (titleTrimmed.length < 5 || titleTrimmed.length > 100) {
      return { success: false, error: 'Title must be between 5 and 100 characters.' };
    }
    if (bodyTrimmed.length < 10 || bodyTrimmed.length > 1500) {
      return { success: false, error: 'Body must be between 10 and 1,500 characters.' };
    }

    // Default image if not provided
    let fallbackImg = '/assets/crops/paddy_mandya.jpg';
    let fallbackAlt = 'Field crop observation';
    if (data.communitySlug === 'tomato-growers') {
      fallbackImg = '/assets/crops/tomato_crop.jpg';
      fallbackAlt = 'Tomato plant observation';
    } else if (data.communitySlug === 'chilli-growers') {
      fallbackImg = '/assets/crops/chilli_crop.jpg';
      fallbackAlt = 'Chilli plant observation';
    } else if (data.communitySlug === 'maharashtra-farmers') {
      fallbackImg = '/assets/crops/sugarcane_field.jpg';
      fallbackAlt = 'Crop and field observation';
    } else if (data.communitySlug === 'tamil-nadu-farmers') {
      fallbackImg = '/assets/crops/millet_field.jpg';
      fallbackAlt = 'Field crop rows observation';
    } else if (data.communitySlug === 'onion-growers') {
      fallbackImg = '/assets/crops/onion_field.jpg';
      fallbackAlt = 'Vegetable cultivation observation';
    }

    const all = this.getItem<Post[]>(STORAGE_KEYS.POSTS, getInitialPosts());
    const id = `post_${Date.now()}`;
    const newPost: Post = {
      id,
      communitySlug: data.communitySlug,
      authorUsername: user.username,
      authorDisplayName: user.displayName,
      title: titleTrimmed,
      body: bodyTrimmed,
      lang: data.lang,
      state: 'published',
      createdAt: new Date().toISOString(),
      imageUrl: data.imageUrl || fallbackImg,
      imageAlt: data.imageAlt || fallbackAlt,
      audioUrl: data.audioUrl,
      upvotes: 0,
      labels: {
        en: { title: titleTrimmed, body: bodyTrimmed },
        kn: { title: titleTrimmed, body: bodyTrimmed },
        hi: { title: titleTrimmed, body: bodyTrimmed },
      },
    };

    all.unshift(newPost);
    try {
      this.setItem(STORAGE_KEYS.POSTS, all);
      return { success: true, post: newPost };
    } catch (err: unknown) {
      if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) {
        return { success: false, error: 'error.storageQuota' };
      }
      return { success: false, error: 'common.errorDesc' };
    }
  }

  // --- Upvotes ---
  public getPostUpvotes(postId: string): number {
    const post = this.getPostById(postId);
    return post?.upvotes ?? 0;
  }

  public isPostUpvoted(postId: string): boolean {
    const user = this.getCurrentUser();
    const upvotedMap = this.getItem<Record<string, string[]>>(STORAGE_KEYS.UPVOTES, {});
    const userKey = user ? user.username : 'guest';
    const userUpvotes = upvotedMap[userKey] || [];
    return userUpvotes.includes(postId);
  }

  public toggleUpvotePost(postId: string): { upvotes: number; hasUpvoted: boolean } {
    const user = this.getCurrentUser();
    const userKey = user ? user.username : 'guest';
    const upvotedMap = this.getItem<Record<string, string[]>>(STORAGE_KEYS.UPVOTES, {});
    const userUpvotes = new Set(upvotedMap[userKey] || []);

    const all = this.getItem<Post[]>(STORAGE_KEYS.POSTS, getInitialPosts());
    const postIndex = all.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return { upvotes: 0, hasUpvoted: false };
    }

    const currentPost = all[postIndex];
    let currentUpvotes = currentPost.upvotes ?? 0;
    let hasUpvoted = false;

    if (userUpvotes.has(postId)) {
      userUpvotes.delete(postId);
      currentUpvotes = Math.max(0, currentUpvotes - 1);
      hasUpvoted = false;
    } else {
      userUpvotes.add(postId);
      currentUpvotes += 1;
      hasUpvoted = true;
    }

    upvotedMap[userKey] = Array.from(userUpvotes);
    all[postIndex] = { ...currentPost, upvotes: currentUpvotes };

    try {
      this.setItem(STORAGE_KEYS.UPVOTES, upvotedMap);
      this.setItem(STORAGE_KEYS.POSTS, all);
    } catch (e) {
      console.error('Failed to save upvote', e);
    }

    return { upvotes: currentUpvotes, hasUpvoted };
  }

  // --- Comments ---
  public getComments(postId: string, page = 1, pageSize = 20, locale?: Locale): PaginatedResult<Comment> {
    const all = this.getItem<Comment[]>(STORAGE_KEYS.COMMENTS, getInitialComments());
    const filtered = all
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize).map((c) => this.localizeComment(c, locale));

    return {
      items,
      page,
      pageSize,
      total,
      hasOlder: startIndex + pageSize < total,
      hasNewer: page > 1,
    };
  }

  public addComment(data: {
    postId: string;
    body: string;
    lang: Locale;
    audioUrl?: string;
  }): { success: boolean; comment?: Comment; error?: string } {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'member') return { success: false, error: 'auth_required' };

    const post = this.getPostById(data.postId);
    if (!post) return { success: false, error: 'Post not found or hidden.' };

    const memberships = this.getMemberships(user.username);
    if (!memberships.includes(post.communitySlug)) {
      return { success: false, error: 'form.joinToCommentNotice' };
    }

    let bodyTrimmed = data.body.trim();
    if (data.audioUrl && !bodyTrimmed) {
      bodyTrimmed = '🎙️ Voice comment';
    }

    if (bodyTrimmed.length < 2 || bodyTrimmed.length > 600) {
      return { success: false, error: 'Comment must be between 2 and 600 characters.' };
    }

    const all = this.getItem<Comment[]>(STORAGE_KEYS.COMMENTS, getInitialComments());
    const id = `comm_${Date.now()}`;
    const newComment: Comment = {
      id,
      postId: data.postId,
      authorUsername: user.username,
      authorDisplayName: user.displayName,
      body: bodyTrimmed,
      lang: data.lang,
      createdAt: new Date().toISOString(),
      audioUrl: data.audioUrl,
      labels: {
        en: { body: bodyTrimmed },
        kn: { body: bodyTrimmed },
        hi: { body: bodyTrimmed },
      },
    };

    all.unshift(newComment);
    try {
      this.setItem(STORAGE_KEYS.COMMENTS, all);
      return { success: true, comment: newComment };
    } catch (err: unknown) {
      if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) {
        return { success: false, error: 'error.storageQuota' };
      }
      return { success: false, error: 'common.errorDesc' };
    }
  }

  // --- Reports & Moderation ---
  public reportPost(postId: string, reason: ReportReason, locale: Locale = 'en'): { success: boolean; error?: string } {
    const user = this.getCurrentUser(locale);
    if (!user || user.role !== 'member') return { success: false, error: 'auth_required' };

    const post = this.getPostById(postId, locale);
    if (!post) return { success: false, error: 'Post not found.' };

    if (post.authorUsername === user.username) {
      return { success: false, error: 'You cannot report your own post.' };
    }

    const all = this.getItem<Report[]>(STORAGE_KEYS.REPORTS, getInitialReports());
    const already = all.some((r) => (r.postId === postId || r.postId === post.id) && r.reporterUsername === user.username);
    if (already) {
      return { success: false, error: 'report.already' };
    }

    const newReport: Report = {
      id: `rep_${Date.now()}`,
      postId: post.id,
      postTitle: post.title,
      reporterUsername: user.username,
      reason,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newReport);
    this.setItem(STORAGE_KEYS.REPORTS, all);
    return { success: true };
  }

  public hasUserReported(postId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const all = this.getItem<Report[]>(STORAGE_KEYS.REPORTS, getInitialReports());
    return all.some((r) => (r.postId === postId || r.postId === `p_${postId}`) && r.reporterUsername === user.username);
  }

  public getOpenReports(page = 1, pageSize = 20, locale: Locale = 'en'): PaginatedResult<Report> {
    const user = this.getCurrentUser(locale);
    if (!user || user.role !== 'admin') {
      return { items: [], page: 1, pageSize: 20, total: 0, hasOlder: false, hasNewer: false };
    }

    const all = this.getItem<Report[]>(STORAGE_KEYS.REPORTS, getInitialReports());
    const openReports = all.filter((r) => r.status === 'open');

    const total = openReports.length;
    const startIndex = (page - 1) * pageSize;
    const items = openReports.slice(startIndex, startIndex + pageSize).map((r) => {
      const targetPost = this.getPostById(r.postId, locale);
      return {
        ...r,
        postTitle: targetPost ? targetPost.title : r.postTitle,
      };
    });

    return {
      items,
      page,
      pageSize,
      total,
      hasOlder: startIndex + pageSize < total,
      hasNewer: page > 1,
    };
  }

  public resolveReport(reportId: string, action: 'dismiss' | 'hide'): { success: boolean; error?: string } {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') return { success: false, error: 'auth_required' };

    const reports = this.getItem<Report[]>(STORAGE_KEYS.REPORTS, getInitialReports());
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport || targetReport.status !== 'open') {
      return { success: false, error: 'Target report changed or already resolved.' };
    }

    if (action === 'dismiss') {
      targetReport.status = 'dismissed';
      this.setItem(STORAGE_KEYS.REPORTS, reports);
      return { success: true };
    }

    if (action === 'hide') {
      // Hide the post itself
      const posts = this.getItem<Post[]>(STORAGE_KEYS.POSTS, getInitialPosts());
      const post = posts.find((p) => p.id === targetReport.postId);
      if (post) {
        post.state = 'hidden';
        this.setItem(STORAGE_KEYS.POSTS, posts);
      }

      // Mark all open reports for this post as hidden
      reports.forEach((r) => {
        if (r.postId === targetReport.postId && r.status === 'open') {
          r.status = 'hidden';
        }
      });
      this.setItem(STORAGE_KEYS.REPORTS, reports);
      return { success: true };
    }

    return { success: false };
  }
}

export const krishiService = new MockKrishiService();

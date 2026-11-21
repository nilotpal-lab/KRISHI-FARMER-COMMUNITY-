export type Locale = 'en' | 'kn' | 'hi';

export type UserRole = 'member' | 'admin';

export interface UserProfile {
  username: string;
  displayName: string;
  displayNames?: Partial<Record<Locale, string>>;
  avatarUrl?: string;
  role: UserRole;
  enabled: boolean;
  passwordHash?: string;
  age?: number;
  experienceYears?: number;
  state?: string;
  district?: string;
  readLangs?: Locale[];
  writeLangs?: Locale[];
  crops?: string[];
  photoDataUrl?: string;
}

export type CommunityKind = 'location' | 'topic';

export interface CommunityLabels {
  name: string;
  description: string;
}

export interface Community {
  id: string;
  slug: string;
  kind: CommunityKind;
  stateKey?: string | null;
  seedOrder?: number | null;
  name: string;
  description: string;
  lang: Locale;
  createdAt: string;
  createdBy?: string | null;
  labels?: Partial<Record<Locale, CommunityLabels>>;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PostLabels {
  title: string;
  body: string;
}

export interface Post {
  id: string;
  key?: string;
  communitySlug: string;
  authorUsername: string;
  authorDisplayName: string;
  title: string;
  body: string;
  lang: Locale;
  state: 'published' | 'hidden';
  createdAt: string;
  imageUrl?: string;
  imageAlt?: string;
  audioUrl?: string;
  kind?: 'normal' | 'problem';
  status?: 'open' | 'solved';
  labels?: Partial<Record<Locale, PostLabels>>;
}

export interface CommentLabels {
  body: string;
}

export interface Comment {
  id: string;
  key?: string;
  postId: string;
  authorUsername: string;
  authorDisplayName: string;
  body: string;
  lang: Locale;
  createdAt: string;
  audioUrl?: string;
  isBestAnswer?: boolean;
  labels?: Partial<Record<Locale, CommentLabels>>;
}

export type ReportReason = 'spam' | 'abuse' | 'unsafe' | 'other';
export type ReportStatus = 'open' | 'dismissed' | 'hidden';

export interface Report {
  id: string;
  key?: string;
  postId: string;
  postTitle: string;
  reporterUsername: string;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: string;
}

export interface IndianState {
  key: string;
  kind: 'state' | 'ut';
  labels: {
    en: string;
    kn: string;
    hi: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasOlder: boolean;
  hasNewer: boolean;
}

export interface BlogPost {
    id: string;
    title: string;
    brief: string;
    slug: string;
    url: string;
    publishedAt: string;
    coverImage?: { url: string };
    author: { name: string; profilePicture?: string };
    tags?: Array<{ name: string; slug: string }>;
}

const DEVTO_USERNAME = import.meta.env.VITE_DEVTO_USERNAME || '';
const DEVTO_API = 'https://dev.to/api';
const CACHE_KEY = 'rnr_devto_posts';
const CACHE_VERSION = 2;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
    version: number;
    posts: BlogPost[];
    fetchedAt: number;
}

let _memCache: BlogPost[] | null = null;
let _pending: Promise<BlogPost[]> | null = null;

type Listener = (posts: BlogPost[]) => void;
const listeners = new Set<Listener>();

/** Subscribe to cache refreshes (stale-while-revalidate updates). */
export function subscribePosts(listener: Listener): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

function isBlogPost(value: unknown): value is BlogPost {
    if (!value || typeof value !== 'object') return false;
    const post = value as Record<string, unknown>;
    return (
        typeof post.id === 'string' &&
        typeof post.title === 'string' &&
        typeof post.url === 'string' &&
        typeof post.publishedAt === 'string' &&
        Array.isArray(post.tags)
    );
}

function readLocalCache(): CacheEntry | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;

        const entry = parsed as Partial<CacheEntry>;
        const valid =
            entry.version === CACHE_VERSION &&
            typeof entry.fetchedAt === 'number' &&
            Array.isArray(entry.posts) &&
            entry.posts.every(isBlogPost);

        if (!valid) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return entry as CacheEntry;
    } catch {
        return null;
    }
}

function writeLocalCache(posts: BlogPost[]): void {
    try {
        const entry: CacheEntry = { version: CACHE_VERSION, posts, fetchedAt: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
        // localStorage unavailable (private mode, quota exceeded) — fail silently
    }
}

function isFresh(entry: CacheEntry): boolean {
    return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

function mapDevtoPost(raw: Record<string, unknown>): BlogPost {
    const tags = ((raw.tag_list as string[]) || []).map((t: string) => ({
        name: t,
        slug: t.toLowerCase().replace(/\s+/g, '-'),
    }));

    return {
        id: String(raw.id),
        title: raw.title as string,
        brief: (raw.description as string) || '',
        slug: raw.slug as string,
        url: raw.url as string,
        publishedAt: (raw.published_at as string) || new Date().toISOString(),
        ...(raw.cover_image ? { coverImage: { url: raw.cover_image as string } } : {}),
        author: {
            name: (raw.user as Record<string, string>)?.name || 'Rolan Lobo',
            profilePicture: (raw.user as Record<string, string>)?.profile_image || undefined,
        },
        tags,
    };
}

async function fetchFromDevto(limit: number): Promise<BlogPost[]> {
    if (!DEVTO_USERNAME) {
        console.warn('VITE_DEVTO_USERNAME is not set — no posts will load.');
        return [];
    }

    // Published articles only: `state=all` would also return unpublished drafts.
    const url = `${DEVTO_API}/articles?username=${encodeURIComponent(DEVTO_USERNAME)}&per_page=${limit}`;
    const response = await fetch(url, {
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
    });
    if (!response.ok) throw new Error(`Dev.to API error: ${response.status}`);

    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Dev.to API returned an unexpected payload');

    return data
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map(mapDevtoPost);
}

function publish(posts: BlogPost[]): BlogPost[] {
    _memCache = posts;
    writeLocalCache(posts);
    listeners.forEach(listener => listener(posts));
    return posts;
}

function hydrateCache(): Promise<BlogPost[]> {
    if (!_pending) {
        _pending = fetchFromDevto(100)
            .then(publish)
            .finally(() => { _pending = null; });
    }
    return _pending;
}

async function getPosts(): Promise<BlogPost[]> {
    // 1. Serve from in-memory cache immediately (same session)
    if (_memCache) return _memCache;

    // 2. Serve from localStorage if fresh
    const stored = readLocalCache();
    if (stored && isFresh(stored)) {
        _memCache = stored.posts;
        return _memCache;
    }

    // 3. Stale-while-revalidate: serve stale data instantly, refresh in background.
    //    The refresh publishes to subscribers so mounted lists update in place.
    if (stored) {
        _memCache = stored.posts;
        hydrateCache().catch(() => {});
        return _memCache;
    }

    // 4. No cache at all — fetch and block
    return hydrateCache();
}

/**
 * Fetch every published post. Failures propagate so callers can tell a real API
 * outage apart from a genuinely empty feed: a successful response with no posts
 * still resolves to [], only a network/API error throws.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    return getPosts();
}

export function formatPostDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

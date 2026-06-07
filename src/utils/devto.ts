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
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
    posts: BlogPost[];
    fetchedAt: number;
}

let _memCache: BlogPost[] | null = null;

function readLocalCache(): CacheEntry | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        return entry;
    } catch {
        return null;
    }
}

function writeLocalCache(posts: BlogPost[]): void {
    try {
        const entry: CacheEntry = { posts, fetchedAt: Date.now() };
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

    const url = `${DEVTO_API}/articles?username=${DEVTO_USERNAME}&per_page=${limit}&state=all`;
    const response = await fetch(url, {
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
    });
    if (!response.ok) throw new Error(`Dev.to API error: ${response.status}`);

    const data = await response.json();
    return (data as Record<string, unknown>[]).map(mapDevtoPost);
}

async function hydrateCache(): Promise<BlogPost[]> {
    const fresh = await fetchFromDevto(100);
    _memCache = fresh;
    writeLocalCache(fresh);
    return fresh;
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

    // 3. Stale-while-revalidate: serve stale data instantly, refresh in background
    if (stored) {
        _memCache = stored.posts;
        hydrateCache().catch(() => {});
        return _memCache;
    }

    // 4. No cache at all — fetch and block
    return hydrateCache();
}

export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
    try {
        const all = await getPosts();
        return all.slice(0, limit);
    } catch (error) {
        console.error('Error fetching blog posts from Dev.to:', error);
        return [];
    }
}

export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        return await getPosts();
    } catch (error) {
        console.error('Error fetching blog posts from Dev.to:', error);
        return [];
    }
}

export function formatPostDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

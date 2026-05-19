/**
 * Dev.to Blog Integration
 *
 * Fetches blog posts from Dev.to's free public API.
 * No API key needed for reading public articles.
 * Works directly from the browser — zero CORS issues.
 *
 * Docs: https://developers.forem.com/api/v1
 */

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

// Will be swapped in once username is set
const DEVTO_USERNAME = import.meta.env.VITE_DEVTO_USERNAME || '';

const DEVTO_API = 'https://dev.to/api';

// In-memory cache so we don't re-fetch on every component render
let _cache: BlogPost[] | null = null;

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

    // No auth header — Dev.to public article reads need none,
    // and sending api-key causes a CORS preflight block.
    const url = `${DEVTO_API}/articles?username=${DEVTO_USERNAME}&per_page=${limit}&state=all`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Dev.to API error: ${response.status}`);

    const data = await response.json();
    return (data as Record<string, unknown>[]).map(mapDevtoPost);
}

/**
 * Fetch latest blog posts
 * @param limit - Number of posts to return (default: 3)
 */
export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
    try {
        if (_cache) return _cache.slice(0, limit);
        // Warm the full cache so subsequent getAllPosts() calls are free
        _cache = await fetchFromDevto(100);
        return _cache.slice(0, limit);
    } catch (error) {
        console.error('Error fetching blog posts from Dev.to:', error);
        return [];
    }
}

/**
 * Fetch all blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        if (_cache) return _cache;
        _cache = await fetchFromDevto(100);
        return _cache;
    } catch (error) {
        console.error('Error fetching blog posts from Dev.to:', error);
        return [];
    }
}

/**
 * Format a date string for display (e.g. "Jan 16, 2026")
 */
export function formatPostDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

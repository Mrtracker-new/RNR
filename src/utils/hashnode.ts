/**
 * Hashnode API Integration
 * Fetches blog posts from Hashnode using their public GraphQL API
 */

// TypeScript Interfaces
export interface BlogPost {
    id: string;
    title: string;
    brief: string;
    slug: string;
    url: string;
    publishedAt: string;
    coverImage?: {
        url: string;
    };
    author: {
        name: string;
        profilePicture?: string;
    };
    tags?: Array<{
        name: string;
        slug: string;
    }>;
}

interface HashnodeResponse {
    data: {
        publication: {
            posts: {
                edges: Array<{
                    node: BlogPost;
                }>;
            };
        };
    };
}

// Configuration
const HASHNODE_API_ENDPOINT = 'https://gql.hashnode.com';
const PUBLICATION_HOST = process.env.REACT_APP_HASHNODE_PUBLICATION_HOST || 'rnr-still-figuring-things-out.hashnode.dev';

/**
 * Fetch latest blog posts
 * @param limit - Number of posts to fetch (default: 3)
 * @returns Array of blog posts
 */
export async function getLatestPosts(limit: number = 3): Promise<BlogPost[]> {
    const query = `
    query GetLatestPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              brief
              slug
              url
              publishedAt
              coverImage {
                url
              }
              author {
                name
                profilePicture
              }
              tags {
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(HASHNODE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    host: PUBLICATION_HOST,
                    first: limit,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Hashnode API error: ${response.status}`);
        }

        const json: HashnodeResponse = await response.json();

        if (!json.data?.publication?.posts?.edges) {
            console.warn('No posts found in Hashnode response');
            return [];
        }

        return json.data.publication.posts.edges.map(edge => edge.node);
    } catch (error) {
        console.error('Error fetching blog posts from Hashnode:', error);
        return []; // Return empty array on error for graceful degradation
    }
}

/**
 * Fetch all blog posts
 * @returns Array of all blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    // Fetch a large number (50) to get "all" posts
    // You can implement pagination if needed in the future
    return getLatestPosts(50);
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 16, 2026")
 */
export function formatPostDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

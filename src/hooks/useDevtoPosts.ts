import { useEffect, useState } from 'react';
import { getAllPosts, subscribePosts, type BlogPost } from '../utils/devto';

interface DevtoPostsState {
  posts: BlogPost[];
  loading: boolean;
  error: boolean;
}

/* One subscription over the module-level Dev.to cache. Home and Blog both use
   this, so a session makes a single request and a background revalidation
   updates every mounted list instead of only the cache object. */
export function useDevtoPosts(limit?: number): DevtoPostsState {
  const [all, setAll] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = subscribePosts(next => {
      if (cancelled) return;
      setAll(next);
      setError(false);
    });

    getAllPosts()
      .then(next => {
        if (cancelled) return;
        setAll(next);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    posts: limit === undefined ? all : all.slice(0, limit),
    loading,
    error,
  };
}

import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { getAllPosts, BlogPost } from '../utils/hashnode';
import { FullScreenLoading } from '../components/LoadingSpinner';

// Lazy load BlogCard to reduce initial bundle size
const BlogCard = lazy(() => import('../components/BlogCard'));

// Styled Components
const BlogSection = styled.section`
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: var(--spacing-20);
  position: relative;

  /* Background gradient */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50vw;
    height: 50vh;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-16);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-extrabold);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-4);
  letter-spacing: -0.025em;
  line-height: 1.2;
  padding-bottom: 0.1em;
`;

const Subtitle = styled(motion.p)`
  font-size: var(--text-lg);
  color: var(--dark-400);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: var(--spacing-8);
  margin-top: var(--spacing-12);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: var(--spacing-20) var(--spacing-6);
  color: var(--dark-400);

  h2 {
    font-size: var(--text-2xl);
    color: var(--dark-200);
    margin-bottom: var(--spacing-4);
  }

  p {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-6);
  }

  a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: var(--font-medium);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorState = styled(EmptyState)`
  h2 {
    color: var(--error, #ef4444);
  }
`;

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(false);
                const fetchedPosts = await getAllPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                console.error('Error loading blog posts:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <FullScreenLoading text="Loading blog posts..." />;
    }

    return (
        <PageTransition>
            <SEO
                title="Blog - Rolan Lobo | Thoughts on Development & Technology"
                description="Read my latest articles on web development, programming, and technology. Learn from my experiences and insights in software engineering."
                url="https://rolan-rnr.netlify.app/blog"
            />

            <BlogSection>
                <Container>
                    <Header>
                        <Title
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Blog
                        </Title>
                        <Subtitle
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Thoughts, tutorials, and insights on development, programming, and technology.
                        </Subtitle>
                    </Header>

                    {error ? (
                        <ErrorState
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2>⚠️ Oops! Something went wrong</h2>
                            <p>We couldn't load the blog posts. Please try again later.</p>
                            <a
                                href="https://rnr-still-figuring-things-out.hashnode.dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit my blog directly on Hashnode →
                            </a>
                        </ErrorState>
                    ) : posts.length === 0 ? (
                        <EmptyState
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2>📝 No posts yet</h2>
                            <p>I haven't published any blog posts yet. Check back soon!</p>
                            <a
                                href="https://rnr-still-figuring-things-out.hashnode.dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Follow me on Hashnode →
                            </a>
                        </EmptyState>
                    ) : (
                        <BlogGrid>
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Suspense fallback={<div style={{ height: '400px' }} />}>
                                        <BlogCard post={post} />
                                    </Suspense>
                                </motion.div>
                            ))}
                        </BlogGrid>
                    )}
                </Container>
            </BlogSection>
        </PageTransition>
    );
};

export default Blog;

import React from 'react';
import styled from 'styled-components';
import { BlogPost, formatPostDate } from '../utils/devto';



const Article = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--spacing-6);
  padding: var(--spacing-6) 0;
  border-bottom: 1px solid var(--divider);
  cursor: pointer;
  transition: none;

  &:last-child { border-bottom: none; }

  &:hover .post-title { color: var(--dark-50); }
  &:hover .post-arrow { color: var(--accent-primary); transform: translate(2px, -2px); }
  &:hover .post-thumb img { filter: brightness(0.9); }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
`;

const PostLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  min-width: 0;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
`;

const PostDate = styled.time`
  font-size: var(--text-2xs);
  font-family: var(--font-mono);
  color: var(--dark-600);
  letter-spacing: var(--tracking-wide);
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--dark-700);
  flex-shrink: 0;
`;

const PostTag = styled.span`
  font-size: var(--text-2xs);
  font-weight: var(--font-medium);
  color: var(--dark-600);
  letter-spacing: var(--tracking-wide);
`;

const PostTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--dark-200);
  line-height: 1.35;
  letter-spacing: var(--tracking-tight);
  transition: color 0.18s ease;

  @media (max-width: 640px) { font-size: var(--text-base); }
`;

const PostExcerpt = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-600);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-3);
  flex-shrink: 0;

  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const PostThumb = styled.div`
  width: var(--blog-thumb-w);
  height: var(--blog-thumb-h);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--dark-900);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.75);
    transition: filter 0.25s ease;
  }

  @media (max-width: 640px) { width: 80px; height: 54px; }
`;

const PostArrow = styled.span`
  font-size: var(--text-base);
  color: var(--dark-700);
  transition: color 0.18s ease, transform 0.18s ease;
  display: block;

  @media (max-width: 640px) { display: none; }
`;

/* ─── Component ───────────────────────────────────────────────────────────── */

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = formatPostDate(post.publishedAt);
  const primaryTag = post.tags?.[0];

  return (
    <Article
      as="a"
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read "${post.title}" on Dev.to`}
    >
      <PostLeft>
        <PostMeta>
          <PostDate dateTime={post.publishedAt}>{formattedDate}</PostDate>
          {primaryTag && (
            <>
              <MetaDot aria-hidden="true" />
              <PostTag>#{primaryTag.name}</PostTag>
            </>
          )}
        </PostMeta>

        <PostTitle className="post-title">{post.title}</PostTitle>

        {post.brief && <PostExcerpt>{post.brief}</PostExcerpt>}
      </PostLeft>

      <PostRight>
        {post.coverImage?.url && (
          <PostThumb className="post-thumb">
            <img
              src={post.coverImage.url}
              alt=""
              loading="lazy"
              decoding="async"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </PostThumb>
        )}
        <PostArrow className="post-arrow" aria-hidden="true">↗</PostArrow>
      </PostRight>
    </Article>
  );
};

export default BlogCard;

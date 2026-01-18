import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BlogPost, formatPostDate } from '../utils/hashnode';

// Styled Components
const Card = styled(motion.article)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(100, 255, 218, 0.3);
    box-shadow: 0 20px 40px rgba(100, 255, 218, 0.1);
  }
`;

const CoverImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${props => props.$imageUrl
    ? `url(${props.$imageUrl})`
    : 'linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
  };
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(9, 9, 11, 0.8) 100%);
  }
`;

const Content = styled.div`
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  flex: 1;
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--dark-100);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Excerpt = styled.p`
  font-size: var(--text-sm);
  color: var(--dark-400);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: var(--spacing-2);
  }
`;

const Date = styled.time`
  font-size: var(--text-xs);
  color: var(--dark-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  margin-top: var(--spacing-2);
`;

const Tag = styled.span`
  font-size: var(--text-xs);
  color: var(--accent-primary);
  background: rgba(100, 255, 218, 0.1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  border: 1px solid rgba(100, 255, 218, 0.2);
`;

const ReadMoreButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: all 0.2s ease;
  width: fit-content;
  white-space: nowrap;
  min-width: max-content;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateX(4px);
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--text-xs);
    gap: var(--spacing-1-5);
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.75rem;
    gap: 6px;
    
    svg {
      width: 11px;
      height: 11px;
    }
  }

  @media (max-width: 640px) {
    padding: 5px 10px;
    font-size: 0.7rem;
    gap: 4px;
    
    svg {
      width: 10px;
      height: 10px;
    }
  }
`;

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = formatPostDate(post.publishedAt);
  const displayTags = post.tags?.slice(0, 3) || [];

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CoverImage $imageUrl={post.coverImage?.url} />

      <Content>
        <Title>{post.title}</Title>

        <Excerpt>{post.brief}</Excerpt>

        {displayTags.length > 0 && (
          <TagsContainer>
            {displayTags.map((tag) => (
              <Tag key={tag.slug}>#{tag.name}</Tag>
            ))}
          </TagsContainer>
        )}

        <Meta>
          <Date dateTime={post.publishedAt}>{formattedDate}</Date>
          <ReadMoreButton
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read on Hashnode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </ReadMoreButton>
        </Meta>
      </Content>
    </Card>
  );
};

export default BlogCard;

import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  EMAIL,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILE_URLS,
  TWITTER_HANDLE,
} from '../utils/site';

/* Site-constant structured data. These blocks are identical on every route, so
   they're serialized once at module load rather than on each render. */
const PERSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  alternateName: ['Rolan RNR', 'RNR', 'Rolan rnr'],
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/logo512.png`,
  sameAs: SOCIAL_PROFILE_URLS,
  jobTitle: 'Software Developer',
  worksFor: { '@type': 'Organization', name: 'Freelance' },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Karnataka',
    addressCountry: 'India',
  },
  email: EMAIL,
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Flask',
    'FastAPI',
    'Rust',
    'Tauri',
    'SQLite',
    'WebSockets',
    'Desktop Applications',
    'Web Development',
    'Android Development',
    'Flutter',
    'Computer Vision',
    'Software Engineering',
    'Cybersecurity',
    'Data Encryption',
    'AES-256',
    'ECDH Key Exchange',
    'Zero-Knowledge Architecture',
    'Steganography',
    'Network Protocol Analysis',
    'AI-Assisted Planning',
  ],
});

const WEBSITE_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rolan Lobo — Developer & Builder',
  alternateName: ['Rolan RNR', SITE_NAME, 'RNR'],
  url: `${SITE_URL}/`,
  author: {
    '@type': 'Person',
    name: SITE_NAME,
    alternateName: 'Rolan RNR',
  },
});

const ORGANIZATION_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Rolan Lobo — Developer & Builder',
  alternateName: ['RNR', 'Rolan RNR', SITE_NAME],
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo512.png`,
    width: 512,
    height: 512,
  },
  description:
    'Software developer building privacy-first tools, systems software, and AI-assisted planning applications.',
  brand: { '@type': 'Brand', name: SITE_NAME },
  foundingDate: '2019',
  founder: {
    '@type': 'Person',
    name: SITE_NAME,
    alternateName: 'Rolan RNR',
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: EMAIL,
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi', 'Kannada'],
  },
  sameAs: SOCIAL_PROFILE_URLS,
});

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedAt?: string;
  modifiedAt?: string;
  tags?: string[];
  noIndex?: boolean;
}

const DEFAULT_KEYWORDS =
  'Rolan Lobo, Rolan RNR, Software Developer, Security Engineer, Freelance Developer, React Developer, Python Developer, Rust Developer, Flask Developer, AES-256 Encryption, Steganography, InvisioVault, BAR, CursorCam, BuildWise AI, Karnataka, India';

const SEO: React.FC<SEOProps> = ({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = OG_IMAGE,
  url = `${SITE_URL}/`,
  type = 'website',
  publishedAt,
  modifiedAt,
  tags,
  noIndex = false,
}) => {
  const siteName = 'Rolan Lobo — Developer & Builder';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Rolan Lobo (Rolan RNR)" />

      {/* Only indexable pages get a canonical. noIndex routes (e.g. 404) would
          otherwise be canonicalised to the page passed in `url`. */}
      {!noIndex && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content={OG_IMAGE_TYPE} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {type === 'article' && (
        <meta property="article:author" content="https://dev.to/rolan_r_n_r" />
      )}
      {tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <link
        rel="alternate"
        type="application/rss+xml"
        title="Rolan Lobo's Blog on Dev.to"
        href="https://dev.to/feed/rolan_r_n_r"
      />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {!noIndex && <link rel="alternate" hrefLang="en" href={url} />}
      {!noIndex && <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />}

      <script type="application/ld+json">{PERSON_LD}</script>
      <script type="application/ld+json">{WEBSITE_LD}</script>
      <script type="application/ld+json">{ORGANIZATION_LD}</script>
    </Helmet>
  );
};

export default SEO;

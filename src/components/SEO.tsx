import React from 'react';
import { Helmet } from 'react-helmet-async';


/* Site-constant structured data. These blocks are identical on every route,
   so they're serialized once at module load rather than on each render. */
const PERSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rolan Lobo',
  alternateName: ['Rolan RNR', 'RNR', 'Rolan rnr'],
  url: 'https://rolan-rnr.netlify.app/',
  image: 'https://rolan-rnr.netlify.app/logo512.png',
  sameAs: [
    'https://github.com/Mrtracker-new',
    'https://www.linkedin.com/in/rolan-lobo/',
    'https://dev.to/rolan_r_n_r'
  ],
  jobTitle: 'Full Stack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance'
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Karnataka',
    addressCountry: 'India'
  },
  email: 'rolanlobo901@gmail.com',
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Flask',
    'MongoDB',
    'Desktop Applications',
    'Web Development',
    'Software Engineering',
    'Cybersecurity',
    'Data Encryption',
    'Steganography',
    'Polyglot Files',
    'File Hiding',
    'Cryptography',
    'Security Applications',
    'Mobile App Development',
    'React Native',
    'Flutter',
    'Freelance Development'
  ]
});

const WEBSITE_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rolan Lobo — Developer & Builder',
  alternateName: ['Rolan RNR', 'Rolan Lobo', 'RNR'],
  url: 'https://rolan-rnr.netlify.app/',
  author: {
    '@type': 'Person',
    name: 'Rolan Lobo',
    alternateName: 'Rolan RNR'
  }
});

const ORGANIZATION_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://rolan-rnr.netlify.app/#organization',
  name: 'Rolan Lobo — Developer & Builder',
  alternateName: ['RNR', 'Rolan RNR', 'Rolan Lobo'],
  url: 'https://rolan-rnr.netlify.app/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://rolan-rnr.netlify.app/logo512.png',
    width: 512,
    height: 512
  },
  description: 'Full-stack developer and builder specializing in security applications, modern web products, and desktop software that solves real problems.',
  brand: {
    '@type': 'Brand',
    name: 'Rolan Lobo'
  },
  foundingDate: '2023',
  founder: {
    '@type': 'Person',
    name: 'Rolan Lobo',
    alternateName: 'Rolan RNR'
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Karnataka',
    addressCountry: 'IN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'rolanlobo901@gmail.com',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi', 'Kannada']
  },
  sameAs: [
    'https://github.com/Mrtracker-new',
    'https://www.linkedin.com/in/rolan-lobo/',
    'https://dev.to/rolan_r_n_r'
  ]
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

const SEO: React.FC<SEOProps> = ({
  title = 'Rolan Lobo — Full-Stack Developer & Security Engineer | Karnataka, India',
  description = 'Rolan Lobo is a full-stack developer from Karnataka, India, specializing in AES-256 encryption tools, privacy-focused applications, and production web software. Available for freelance and full-time remote roles.',
  keywords = 'Rolan Lobo, Rolan RNR, Full Stack Developer, Security Engineer, Software Engineer, Freelance Developer, React Developer, Python Developer, Flask Developer, AES-256 Encryption, Steganography, InvisioVault, BAR, CursorCam, Karnataka, India',
  image = 'https://rolan-rnr.netlify.app/Social_card.png',
  url = 'https://rolan-rnr.netlify.app/',
  type = 'website',
  publishedAt,
  modifiedAt,
  tags,
  noIndex = false
}) => {

  const siteName = 'Rolan Lobo — Developer & Builder';
  const twitterHandle = '@RolanLobo4';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Rolan Lobo (Rolan RNR)" />
      {/* Only assert a canonical on indexable pages. noIndex routes (e.g. 404)
          don't pass a url, so emitting one here would wrongly canonicalize
          them to the homepage. */}
      {!noIndex && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1536" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt" content="Rolan Lobo — Full-Stack Developer & Security Engineer" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Rolan Lobo — Full-Stack Developer & Security Engineer" />

      {/* Article Open Graph Tags */}
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

      {/* Dev.to RSS Alternate Feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Rolan Lobo's Blog on Dev.to"
        href="https://dev.to/feed/rolan_r_n_r"
      />

      {/* Additional Meta Tags */}
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      }
      <meta name="language" content="English" />
      <meta name="theme-color" content="#0a0b0d" />

      {/* hreflang — indexable pages only, for the same reason as the canonical */}
      {!noIndex && <link rel="alternate" hrefLang="en" href={url} />}
      {!noIndex && <link rel="alternate" hrefLang="x-default" href="https://rolan-rnr.netlify.app/" />}

      {/* Structured Data (JSON-LD) — site constants, serialized once at module scope */}
      <script type="application/ld+json">{PERSON_LD}</script>
      <script type="application/ld+json">{WEBSITE_LD}</script>
      <script type="application/ld+json">{ORGANIZATION_LD}</script>
    </Helmet>
  );
};

export default SEO;
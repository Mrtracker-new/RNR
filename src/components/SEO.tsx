import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Rolan Lobo (Rolan RNR) - Full Stack Developer & Software Engineer',
  description = 'Rolan Lobo (also known as Rolan RNR) is a Freelance Full Stack Developer & Software Engineer specializing in security applications, steganography, polyglot files, and modern web development. Creator of InvisioVault, YouTube Downloader, and Sortify.',
  keywords = 'Rolan Lobo, Rolan RNR, Rolan rnr, rolan lobo, Full Stack Developer, Software Engineer, Freelance Developer, Freelancer India, Web Developer, Python Developer, Flask Developer, React Developer, Steganography, Polyglot Files, InvisioVault, RNR',
  image = 'https://rolan-rnr.netlify.app/logo512.png',
  url = 'https://rolan-rnr.netlify.app/',
  type = 'website'
}) => {
  const siteName = 'Rolan Lobo (Rolan RNR) Portfolio';
  const twitterHandle = '@RolanLobo4';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Rolan Lobo (Rolan RNR)" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content={twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#64ffda" />

      {/* Structured Data (JSON-LD) - Person Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Rolan Lobo',
          alternateName: ['Rolan RNR', 'RNR', 'Rolan rnr'],
          url: 'https://rolan-rnr.netlify.app/',
          image: 'https://rolan-rnr.netlify.app/logo512.png',
          sameAs: [
            'https://github.com/Mrtracker-new',
            'https://www.linkedin.com/in/rolan-lobo-93368a239/',
            'https://rnr-still-figuring-things-out.hashnode.dev/'
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
            'Freelance Development'
          ]
        })}
      </script>

      {/* Structured Data (JSON-LD) - Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Rolan Lobo (Rolan RNR) Portfolio',
          alternateName: ['Rolan RNR Portfolio', 'Rolan Lobo Portfolio'],
          url: 'https://rolan-rnr.netlify.app/',
          author: {
            '@type': 'Person',
            name: 'Rolan Lobo',
            alternateName: 'Rolan RNR'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://rolan-rnr.netlify.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>

      {/* Structured Data (JSON-LD) - Organization Schema (Self-Branded) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': 'https://rolan-rnr.netlify.app/#organization',
          name: 'RNR - Rolan Lobo Portfolio',
          alternateName: ['RNR', 'Rolan RNR'],
          url: 'https://rolan-rnr.netlify.app/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://rolan-rnr.netlify.app/logo512.png',
            width: 512,
            height: 512
          },
          description: 'Full Stack Developer & Software Engineer specializing in modern web applications, desktop software, and security-focused solutions.',
          brand: {
            '@type': 'Brand',
            name: 'Rolan RNR'
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
            'https://www.linkedin.com/in/rolan-lobo-93368a239/',
            'https://rnr-still-figuring-things-out.hashnode.dev/'
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
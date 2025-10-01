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
  title = 'Rolan Lobo - Full Stack Developer & Software Engineer',
  description = 'Full Stack Developer & Freelancer specializing in modern web applications, desktop software, and security-focused solutions. Expert in React, Python, Node.js, and more.',
  keywords = 'Full Stack Developer, Web Developer, Python Developer, React Developer, Software Engineer, Freelancer, Desktop Applications, Security Applications, Steganography, Rolan Lobo, RNR',
  image = 'https://rolan-rnr.netlify.app/logo512.png',
  url = 'https://rolan-rnr.netlify.app/',
  type = 'website'
}) => {
  const siteName = 'Rolan Lobo Portfolio';
  const twitterHandle = '@YourTwitterHandle'; // Update with your Twitter handle

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Rolan Lobo" />
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
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#64ffda" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Rolan Lobo',
          alternateName: 'RNR',
          url: 'https://rolan-rnr.netlify.app/',
          image: 'https://rolan-rnr.netlify.app/logo512.png',
          sameAs: [
            'https://github.com/Mrtracker-new',
            'https://www.linkedin.com/in/rolan-lobo-93368a239/',
          ],
          jobTitle: 'Full Stack Developer',
          worksFor: {
            '@type': 'Organization',
            name: 'Freelancer'
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Yellapur',
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
            'Data Encryption'
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
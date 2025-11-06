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
  description = 'Freelance Full Stack Developer & Software Engineer specializing in security applications, steganography, polyglot files, web development, and desktop software. Creator of InvisioVault (hide files in images & polyglot files), YouTube Downloader, file encryption tools, and more. Expert in React, Python, Flask, Node.js, TypeScript, and React Native. Available for freelance projects worldwide.',
  keywords = 'Full Stack Developer, Software Engineer, Freelance Developer, Freelancer India, Web Developer, Python Developer, Flask Developer, React Developer, Steganography, Polyglot Files, Hide Files in Images, File Hiding, Cryptography, AES Encryption, YouTube Downloader, Video Downloader, YouTube to MP3, File Encryption Software, Security Applications, Desktop Applications, File Manager, Contact Manager, React Native Apps, Android Apps, InvisioVault, BAR, Sortify, Hire Freelance Developer, Rolan Lobo, RNR',
  image = 'https://rolan-rnr.netlify.app/logo512.png',
  url = 'https://rolan-rnr.netlify.app/',
  type = 'website'
}) => {
  const siteName = 'Rolan Lobo Portfolio';
  const twitterHandle = '@RolanLobo4';

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

      {/* Structured Data (JSON-LD) - Person Schema */}
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
            'https://rnr-still-figuring-things-out.hashnode.dev/'
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

      {/* Structured Data (JSON-LD) - Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': 'https://rolan-rnr.netlify.app/#organization',
          name: 'RNR - Rolan Lobo Portfolio',
          alternateName: 'RNR',
          url: 'https://rolan-rnr.netlify.app/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://rolan-rnr.netlify.app/logo512.png',
            width: 512,
            height: 512
          },
          description: 'Full Stack Developer & Software Engineer specializing in modern web applications, desktop software, and security-focused solutions.',
          foundingDate: '2023',
          founder: {
            '@type': 'Person',
            name: 'Rolan Lobo'
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Yellapur',
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
          ],
          areaServed: {
            '@type': 'Place',
            name: 'Worldwide'
          },
          serviceType: [
            'Web Development',
            'Desktop Application Development',
            'UI/UX Design',
            'Software Engineering',
            'Cybersecurity Solutions'
          ],
          knowsAbout: [
            'React',
            'Python',
            'Node.js',
            'TypeScript',
            'Flask',
            'MongoDB',
            'Full Stack Development',
            'Desktop Applications',
            'Data Security',
            'AES Encryption',
            'Steganography',
            'Polyglot Files',
            'File Hiding in Images',
            'Cryptography',
            'Security Applications',
            'File Encryption',
            'Freelance Development'
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
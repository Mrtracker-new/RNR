import React from 'react';
import { Helmet } from 'react-helmet-async';

const FAQSchema: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Rolan Lobo offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I offer full-stack web development, desktop application development, UI/UX design, data security solutions including AES encryption and steganography, and technical writing/blogging services.'
        }
      },
      {
        '@type': 'Question',
        name: 'What technologies does Rolan specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I specialize in React, TypeScript, Python, Node.js, Flask, MongoDB, and modern web technologies. I also have expertise in desktop application development and cybersecurity.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Rolan available for freelance projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, I am currently available for freelance projects. You can contact me through the contact form on my portfolio website or email me at rolanlobo901@gmail.com.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is Rolan Lobo located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I am based in Yellapur, Karnataka, India (IST timezone - UTC +5:30). I work remotely and collaborate with clients worldwide.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes Rolan\'s portfolio unique?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'My portfolio showcases unique projects in security applications like InvisioVault_R (steganography with AES-256 encryption), BAR (secure file management), and various web applications. I focus on creating functional, innovative, and security-focused solutions.'
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;

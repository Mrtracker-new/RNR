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
          text: 'Yes, I am currently available for freelance projects. You can reach me through the contact form on my site or email me directly at rolanlobo901@gmail.com.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is Rolan Lobo located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I am based in Karnataka, India (IST timezone - UTC +5:30). I work remotely and collaborate with clients worldwide.'
        }
      },
      {
        '@type': 'Question',
        name: "What sets Rolan's work apart?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I build things that solve real problems — from security applications like InvisioVault_R (steganography with AES-256 encryption) and BAR (secure file management), to web apps and desktop tools. I focus on craft, performance, and genuine usefulness.'
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

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { NAV, SITE_URL } from '../utils/site';

const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();

  /* Home is a single-item trail and unknown paths (404) are not part of the
     site hierarchy, so neither should advertise a BreadcrumbList. */
  const current = NAV.find(item => item.path === pathname && item.path !== '/');
  if (!current) return null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: current.label, item: `${SITE_URL}${current.path}` },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
};

export default Breadcrumb;

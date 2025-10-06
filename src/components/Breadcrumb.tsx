import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const baseUrl = 'https://rolan-rnr.netlify.app';

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { name: 'Home', url: baseUrl }
    ];

    const pathname = location.pathname;
    if (pathname !== '/' && pathname !== '') {
      const pageName = pathname.replace('/', '');
      const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      items.push({
        name: formattedName,
        url: `${baseUrl}${pathname}`
      });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default Breadcrumb;

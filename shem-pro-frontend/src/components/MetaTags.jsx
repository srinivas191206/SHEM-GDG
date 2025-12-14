import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ title, description, canonical, imageUrl, ogType }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {/* Add more meta tags as needed for social media, etc. */}
    </Helmet>
  );
};

export default MetaTags;
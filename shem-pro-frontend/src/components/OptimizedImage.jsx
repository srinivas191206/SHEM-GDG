import React from 'react';
import LazyLoadImage from './LazyLoadImage';

const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      {...props}
    />
  );
};

export default OptimizedImage;
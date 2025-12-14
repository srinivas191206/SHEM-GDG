import React, { useRef, useEffect, useState } from 'react';

const LazyLoadImage = ({ src, alt, className, ...props }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(imgRef.current);
            }
          });
        },
        {
          rootMargin: '300px',
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
      loading="lazy" // Native lazy loading as a fallback
      {...props}
    />
  );
};

export default LazyLoadImage;
import React, { useRef, useEffect, useState } from 'react';

const LazyLoadChart = ({ children }) => {
  const chartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(chartRef.current);
          }
        });
      },
      {
        rootMargin: '300px',
      }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  return <div ref={chartRef}>{isVisible ? children : <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Chart...</div>}</div>;
};

export default LazyLoadChart;
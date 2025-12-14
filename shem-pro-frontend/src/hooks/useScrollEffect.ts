import { useState, useEffect, useCallback } from 'react';

const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const useScrollEffect = (threshold: number = 0) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(
    debounce(() => {
      const isScrolled = window.scrollY > threshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    }, 100),
    [scrolled, threshold]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return scrolled;
};

export default useScrollEffect;
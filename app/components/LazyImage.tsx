'use client';

import { useState, memo } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  onLoad,
  onError 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  return (
    <div ref={targetRef} className={`relative ${className}`}>
      {!isIntersecting ? (
        // Placeholder before image comes into view
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ) : hasError ? (
        // Error state
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      ) : (
        <>
          {/* Loading spinner */}
          {isLoading && !isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 z-10">
              <LoadingSpinner size="sm" />
            </div>
          )}
          
          {/* Actual image */}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onLoadStart={handleImageLoadStart}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
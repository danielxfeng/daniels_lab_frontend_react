import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { tweenTransition } from '@/lib/animations';

/**
 * @summary LazyImage component
 * @param src - The source URL of the image
 * @param alt - The alt text for the image
 * @param className - Additional class names for styling, at least width and height
 * @returns A lazy-loaded image component
 */
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  // Manage the loading state and error state
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Set the actual source to a placeholder image if there is an error
  const actualSrc = error ? '/cover.png' : src;

  return (
    <div className={cn('bg-muted relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {!loaded && <div className='bg-muted absolute inset-0 animate-pulse' aria-hidden />}

      <motion.img
        src={actualSrc}
        alt={alt}
        loading='lazy'
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={tweenTransition}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
};

export default LazyImage;

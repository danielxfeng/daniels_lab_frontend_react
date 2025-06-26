import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';

import MotionSpan from '@/components/motion_components/MotionSpan';
import siteMeta from '@/constants/siteMeta';
import { cn } from '@/lib/utils';

/**
 * @summary Hero component for the homepage.
 * @description
 * It includes:
 * - A background gradient.
 * - A Gravity Particle toy.
 * - A hero section.
 */
const Hero = () => {
  const GravityParticles = lazy(
    () => import('@/components/features/gravity_particles/GravityParticles'),
  );
  const [isParticlesHover, setIsParticlesHover] = useState(false);

  return (
    <section data-role='hero' className='relative w-full overflow-hidden leading-relaxed'>
      {/* Background gradient for the hero section */}
      <div
        className='pointer-events-none absolute inset-0 z-5'
        data-role='gradient-bg'
        aria-hidden='true'
      >
        <div className='absolute bottom-0 left-1/2 h-[20vh] w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-t from-gray-600 via-transparent to-transparent blur-[100px]' />
      </div>

      {/* Background particles transition effect, we keep it z-50 */}
      <Suspense fallback={null}>
        <GravityParticles
          mode='container'
          isParticlesHover={isParticlesHover}
          setIsParticlesHover={setIsParticlesHover}
        />
      </Suspense>

      {/* Main content of the hero section */}
      <div
        data-role='hero-main'
        className='z-10 mx-auto max-w-4xl px-4 py-6 pt-16 sm:px-6 lg:px-8 lg:py-16'
      >
        {/* Hero content */}
        <div data-role='hero-content' className='flex flex-col items-center'>
          <h1 className='sr-only'>{siteMeta.siteName}</h1>
          <div
            data-role='hero-text'
            className={'pointer-events-none z-100 flex flex-col items-center'}
          >
            <div
              className={cn(
                'w-fit rounded-xl p-3',
                isParticlesHover && 'bg-background/40 pointer-events-none backdrop-blur-sm',
              )}
            >
              <motion.h1
                initial={{ opacity: 0, y: 0, filter: 'blur(16px)', scale: 1.2 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                className='font-bold text-shadow-md'
              >
                <span className='block text-2xl sm:text-3xl lg:inline-block lg:text-4xl'>
                  Welcome to
                </span>
                <span className='text-highlight mx-3 block text-4xl sm:text-5xl lg:inline-block lg:text-6xl'>
                  Daniel's Lab
                </span>
              </motion.h1>
            </div>

            <div
              className={cn(
                'mt-56 w-fit rounded-xl p-3',
                isParticlesHover && 'bg-background/40 pointer-events-none backdrop-blur-sm',
              )}
            >
              <MotionSpan
                text="Let's build something coooooool!"
                delay={0.06}
                className='text-muted-foreground text-lg font-medium italic sm:text-xl'
                spanClassNames={Array.from("Let's build something coooooool!").map((_, i) =>
                  i >= 22 ? 'text-pink-500 font-semibold' : '',
                )}
              />

              <motion.div className='mt-10 flex justify-center gap-2 space-y-2 text-2xl font-medium text-shadow-sm lg:gap-6'>
                {['·  Full stack', '·  Systems', '·  AI'].map((text, index) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 1.2 + index * 0.4,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {text}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

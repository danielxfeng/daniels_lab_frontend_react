import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';

import MotionSpan from '@/components/motion_components/MotionSpan';
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
    <section data-role='hero' className='relative z-40 w-full overflow-hidden leading-relaxed'>
      {/* Background gradient for the hero section */}
      <div
        className='pointer-events-none absolute inset-0 z-5'
        data-role='gradient-bg'
        aria-hidden='true'
      >
        <div className='absolute bottom-0 left-1/2 h-[30vh] w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-t from-gray-600 via-transparent to-transparent blur-[100px]' />
      </div>

      {/* Background particles transition effect */}
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
        className='z-10 mx-auto w-full max-w-4xl px-4 py-6 pt-10 sm:px-6 lg:px-8 lg:py-18'
      >
        {/* Hero content */}
        <div
          data-role='hero-content'
          className='flex min-h-[70svh] w-full flex-col items-center lg:min-h-[63svh]'
        >
          <div
            data-role='hero-text'
            className='pointer-events-none z-50 flex min-h-[70svh] w-full flex-col items-center justify-between lg:min-h-[63svh]'
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
                className='flex flex-col gap-2 font-bold'
              >
                <span className='text-foreground/75 block text-2xl font-semibold tracking-tight drop-shadow-sm lg:text-3xl'>
                  Welcome to
                </span>
                <span className='block bg-gradient-to-br from-[#615fff] to-[#155dfc] bg-clip-text text-5xl text-transparent drop-shadow-md lg:inline-block lg:text-6xl'>
                  Daniel's Lab
                </span>
              </motion.h1>
            </div>

            <div
              className={cn(
                'w-fit rounded-xl p-3',
                isParticlesHover && 'bg-background/40 pointer-events-none backdrop-blur-sm',
              )}
            >
              <MotionSpan
                text="Let's build something coooooool!"
                delay={0.06}
                className='text-muted-foreground text-md font-medium italic sm:text-lg'
                spanClassNames={Array.from("Let's build something coooooool!").map((_, i) =>
                  i >= 22 ? 'text-pink-500 font-semibold' : '',
                )}
              />

              <motion.div className='text-foreground/75 mt-4 flex justify-center gap-2 space-y-2 text-xl font-medium text-shadow-sm lg:mt-10 lg:gap-6'>
                {['Web Dev', '·', 'Systems', '·', 'AI'].map((text, index) => (
                  <motion.div
                    key={text + index}
                    initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 1.2 + index * 0.4,
                      duration: 0.4,
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

import { lazy, Suspense, useState } from 'react';

import MotionSpan from '@/components/motion_components/MotionSpan';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import siteMeta from '@/constants/siteMeta';
import { cn } from '@/lib/utils';

/**
 * @summary Hero component for the homepage.
 * @description
 * It includes:
 * - A background gradient.
 * - A Gravity Particle toy.
 * - A hero section with an avatar and introductory text.
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
        className='z-10 mx-auto max-w-4xl px-4 py-6 pt-16 sm:px-6 lg:px-8 lg:pt-26'
      >
        {/* Hero content */}
        <div data-role='hero-content' className='flex flex-col gap-6 text-lg'>
          <h1 className='sr-only'>{siteMeta.siteName}</h1>
          <Avatar className='ring-offset-background ring-muted pointer-events-none z-100 h-24 w-24 shadow-xl ring-2 ring-offset-2'>
            <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
            <AvatarFallback>Daniel</AvatarFallback>{' '}
          </Avatar>
          <div
            data-role='hero-text'
            className={cn(
              'z-100 flex w-fit flex-col rounded-xl p-2',
              isParticlesHover && 'bg-background/40 backdrop-blur-sm',
            )}
          >
            <p>
              <span className='flex items-end gap-2' aria-hidden='true'>
                <span className='text-2xl' aria-hidden='true'>
                  Hi!
                </span>
                <span aria-hidden='true'>Welcome to my lab!</span>
              </span>
            </p>
            <p>
              <span data-role='span-line' className='my-0.5 block' aria-hidden='true'>
                <span className='inline-block' aria-hidden='true'>
                  I am{' '}
                  <MotionSpan
                    text={siteMeta.me}
                    className='text-highlight px-2 py-1 text-3xl font-bold text-shadow-md dark:text-blue-500'
                  />
                  ,
                </span>
                <span data-role='span-line' className='my-0.5 block' aria-hidden='true'>
                  <span className='text-muted-foreground italic' aria-hidden='true'>
                    a{' '}
                  </span>
                  <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                    {siteMeta.myProfession}
                  </span>
                  <span className='text-muted-foreground italic' aria-hidden='true'>
                    {' '}
                    based in{' '}
                  </span>
                  <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                    {siteMeta.myLocation}
                  </span>
                  .
                </span>
              </span>
            </p>
            <p>
              <span data-role='span-line' className='my-0.5 block' aria-hidden='true'>
                <span className='text-muted-foreground inline-block' aria-hidden='true'>
                  I focus on{' '}
                  <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                    full stack
                  </span>{' '}
                  development, both backend and frontend,{' '}
                </span>
              </span>
              <span data-role='span-line' className='my-0.5 block' aria-hidden='true'>
                <span className='text-muted-foreground inline-block' aria-hidden='true'>
                  and also enjoy{' '}
                  <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                    system programming
                  </span>{' '}
                  and building <span className='text-foreground text-xl font-semibold'>AI</span>{' '}
                  toys.
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { lazy, Suspense, useState } from 'react';

import { ParticlesTransitionMode } from '@/components/3d/ParticlesTransition';
import MotionSpan from '@/components/motion_components/MotionSpan';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import siteMeta from '@/constants/siteMeta';
import { cn } from '@/lib/utils';

/**
 * @summary Hero component for the homepage.
 * @description
 * It includes:
 * - A background gradient.
 * - A particles transition effect.
 * - A hero section with an avatar and introductory text.
 */
const Hero = () => {
  const ParticlesTransitionComp = lazy(() => import('@/components/3d/ParticlesTransition'));
  const [particlesMode, setParticlesMode] = useState<ParticlesTransitionMode>('wrapped');
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

      {/* Main content of the hero section */}
      <div
        data-role='hero-main'
        className='relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8'
      >
        {/* Background particles transition effect */}
        <Suspense fallback={null}>
          <ParticlesTransitionComp mode={particlesMode} setParticlesMode={setParticlesMode} />
        </Suspense>
        {/* Hero content */}
        <div data-role='hero-content' className='z-10 flex flex-col gap-6 text-lg'>
          <h1 className='sr-only'>{siteMeta.siteName}</h1>
          <Avatar className='ring-offset-background ring-muted h-24 w-24 shadow-xl ring-2 ring-offset-2'>
            <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
            <AvatarFallback>Daniel</AvatarFallback>{' '}
          </Avatar>
          <div
            data-role='hero-text'
            className={cn(
              'flex w-fit flex-col rounded-xl p-2',
              //'bg-background/40 backdrop-blur-sm',
            )}
          >
            <p>
              <span className='flex items-end gap-2' aria-hidden='true'>
                <span className='text-2xl font-light' aria-hidden='true'>
                  Hi!
                </span>
                <span aria-hidden='true'>Welcome to my lab!</span>
              </span>
            </p>
            <p>
              <span className='inline-block' aria-hidden='true'>
                I am{' '}
                <MotionSpan
                  text={siteMeta.me}
                  className='text-highlight px-2 py-1 text-3xl font-bold text-shadow-md dark:text-blue-500'
                />
                ,
                <br />
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
            </p>
            <p>
              <span className='text-muted-foreground inline-block' aria-hidden='true'>
                I focus on{' '}
                <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                  full stack
                </span>{' '}
                development, both backend and frontend, <br />
                and also enjoy{' '}
                <span className='text-foreground text-xl font-semibold' aria-hidden='true'>
                  system programming
                </span>{' '}
                and building <span className='text-foreground text-xl font-semibold'>AI</span> toys.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

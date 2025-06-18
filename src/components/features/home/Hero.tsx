import { lazy, Suspense } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import siteMeta from '@/constants/siteMeta';

const Hero = () => {
  const ParticlesTransitionComp = lazy(() => import('@/components/3d/ParticlesTransition'));
  return (
    <section data-role='hero' className='relative w-full overflow-hidden'>
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
          <ParticlesTransitionComp numbers={1000} mode='wrapped' baseColor='#0066ff' />
        </Suspense>

        {/* Hero content */}
        <div data-role='hero-content' className='flex flex-col gap-6 text-lg'>
          <h1 className='sr-only'>{siteMeta.siteName}</h1>
          <Avatar className='ring-offset-background ring-muted h-24 w-24 shadow-xl ring-2 ring-offset-2'>
            <AvatarImage src={siteMeta.myAvatar} alt='@Daniel' />
            <AvatarFallback>Daniel</AvatarFallback>{' '}
          </Avatar>
          <div
            data-role='hero-text'
            className='bg-background/40 flex w-fit flex-col rounded-xl p-2 backdrop-blur-sm'
          >
            <p>
              <span className='flex items-end gap-2'>
                <span className='text-2xl font-light'>Hi!</span>
                <span>Welcome to my lab!</span>
              </span>
            </p>
            <p>
              <span className='inline-block'>
                I am{' '}
                <span className='text-highlight px-2 py-1 text-3xl font-bold text-shadow-md dark:text-blue-500'>
                  {siteMeta.me}
                </span>
                ,
                <br />
                <span className='text-muted-foreground italic'>a </span>
                <span className='text-foreground text-xl font-semibold'>
                  {siteMeta.myProfession}
                </span>
                <span className='text-muted-foreground italic'> based in </span>
                <span className='text-foreground text-xl font-semibold'>{siteMeta.myLocation}</span>
                .
              </span>
            </p>
            <p>
              <span className='text-muted-foreground inline-block'>
                I focus on <span className='text-foreground text-xl font-semibold'>full stack</span>{' '}
                development, both backend and frontend, <br />
                and also enjoy{' '}
                <span className='text-foreground text-xl font-semibold'>
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

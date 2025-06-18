import { lazy, Suspense } from 'react';

import siteMeta from '@/constants/siteMeta';

const Hero = () => {
  const ParticlesTransitionComp = lazy(() => import('@/components/3d/ParticlesTransition'));
  return (
    <section data-role='hero' className='relative h-60 w-full overflow-hidden'>
      <Suspense fallback={null}>
        <ParticlesTransitionComp numbers={1000} mode='wrapped' baseColor='#0066ff' />
      </Suspense>
      <div data-role='hero-main'>
        <div data-role='hero-content'>
          <h1 className=''>Welcome to {siteMeta.siteName}</h1>
          <p className='mt-4 text-center text-lg text-gray-700'>{siteMeta.siteDescription}</p>
        </div>
        <div data-role='hero-playground'>placeholder</div>
      </div>
      <div data-role='hero-footer'>
        <p>Node.js</p>
      </div>
    </section>
  );
};

export default Hero;

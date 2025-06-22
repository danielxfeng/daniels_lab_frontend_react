import { Suspense } from 'react';

import GravityParticles from '@/components/features/gravity_particles/GravityParticles';
import Loading from '@/components/shared/Loading';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

// A component to set the meta information for SEO
const MetaInfo = () => (
  <>
    <title>{`Gravity Particles - ${siteMeta.siteName}`}</title>
    <meta
      name='description'
      content='Gravity Particles, a toy built by three.js and React Three Fiber'
    />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={`Gravity Particles - ${siteMeta.siteName}`} />
    <meta
      property='og:description'
      content='Gravity Particles, a toy built by three.js and React Three Fiber'
    />
    <meta property='og:type' content='article' />
    <meta property='og:url' content={`${siteMeta.siteUrl}`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content={siteMeta.siteName} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={`Gravity Particles - ${siteMeta.siteName}`} />
    <meta
      name='twitter:description'
      content='Gravity Particles, a toy built by three.js and React Three Fiber'
    />
    <meta name='twitter:image' content={`${siteMeta.siteUrl}/cover.png`} />
  </>
);

/**
 * @summary A simple landing page for Gravity Particles
 * More features is building.
 */
const GravityParticlesPage = () => (
  <Suspense fallback={<Loading />}>
    <MetaInfo />
    <div className='relative h-full w-full flex-grow overflow-hidden'>
      <NotificationBar />
      <h1 className='sr-only'>Gravity Particles, a toy built by three.js and React Three Fiber</h1>
      <GravityParticles
        mode='full-screen'
        isParticlesHover={false}
        setIsParticlesHover={() => {}}
      />
    </div>
  </Suspense>
);

export default GravityParticlesPage;

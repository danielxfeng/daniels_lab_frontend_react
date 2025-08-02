'use client';

import ProjectCards from '@/components/features/home/ProjectCards';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

const MetaInfo = () => (
  <>
    <title>{`Projects - ${siteMeta.siteName}`}</title>
    <meta name='description' content="Projects of Daniel's lab" />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={`Projects - ${siteMeta.siteName}`} />
    <meta property='og:description' content="Projects of Daniel's lab" />
    <meta property='og:type' content='article' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/projects`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content={siteMeta.siteName} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={`Projects - ${siteMeta.siteName}`} />
    <meta name='twitter:description' content="Projects of Daniel's lab" />
    <meta name='twitter:image' content={`${siteMeta.siteUrl}/cover.png`} />
  </>
);

const GravityParticlesPage = () => (
  <>
    <MetaInfo />
    <NotificationBar />
    <ProjectCards position='page'/>
  </>
);

export default GravityParticlesPage;

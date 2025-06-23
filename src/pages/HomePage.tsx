import AboutMe from '@/components/features/home/AboutMe';
import Hero from '@/components/features/home/Hero';
import ProjectCards from '@/components/features/home/ProjectCards';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

// A component to set the meta information for SEO
const MetaInfo = () => (
  <>
    <title>{`${siteMeta.siteName}`}</title>
    <meta name='description' content={siteMeta.siteDescription} />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={siteMeta.siteName} />
    <meta property='og:description' content={siteMeta.siteDescription} />
    <meta property='og:type' content='article' />
    <meta property='og:url' content={`${siteMeta.siteUrl}`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content={siteMeta.siteName} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={siteMeta.siteName} />
    <meta name='twitter:description' content={siteMeta.siteDescription} />
    <meta name='twitter:image' content={`${siteMeta.siteUrl}/cover.png`} />
  </>
);

/**
 * @summary The main page of the application.
 * It contains the hero section, project cards, featured posts, and about me section.
 */
const HomePage = () => {
  return (
    <>
      <MetaInfo />
      <NotificationBar isVisible={false} />
      <section className='flex w-full flex-col items-center gap-6' data-role='home-page'>
        <Hero />
        <ProjectCards position='div' />
        <div className='outer-container bg-white py-6 dark:bg-neutral-950'>
          <AboutMe position='div' />
        </div>
      </section>
    </>
  );
};

export default HomePage;

import siteMeta from '@/constants/siteMeta';

const Hero = () => {
  return (
    <section data-role='hero'>
      <div data-role='hero-header' aria-hidden='true'></div>
      <div data-role='hero-main'>
        <div data-role='hero-content'>
          <h1 className='text-center text-4xl font-bold'>Welcome to {siteMeta.siteName}</h1>
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

import MotionH1 from '@/components/motion_components/MotionH1';

const AboutMe = ({ position }: { position: 'page' | 'div' }) => {
  return (
    <section data-role='featured-posts-section' className='inner-container my-3'>
      {position === 'div' ? <h2 className='my-6'>About Me</h2> : <MotionH1>About Me</MotionH1>}

      <div
        data-role='featured-posts-list'
        className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
      ></div>
    </section>
  );
};

export default AboutMe;

import ContactLink from '@/components/shared/ContactLink';
import contactIconList from '@/constants/contactLinks';
import MotionTextLink from '../motion_components/MotionTextLink';

/**
 * The Footer component.
 */
const Footer = () => (
  <footer className='outer-container text-muted-foreground my-3 mt-12 py-3 text-sm lg:mb-16'>
    <div className='inner-container flex flex-col items-center justify-center gap-3 lg:max-w-2xl lg:flex-row lg:gap-12'>
      <div className='flex gap-4'>
        {contactIconList.map((prop) => (
          <ContactLink key={prop.ariaLabel} {...prop} />
        ))}
      </div>
      <div>
        This website is open sourced on{' '}
        <MotionTextLink
          to='https://github.com/danielxfeng/daniels_lab'
          label='Github'
          isExternal={true}
          className='underline'
        />
      </div>
    </div>
  </footer>
);

export default Footer;

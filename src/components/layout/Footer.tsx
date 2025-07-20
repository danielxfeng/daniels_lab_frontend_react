import ContactLink from '@/components/shared/ContactLink';
import contactIconList from '@/constants/contactLinks';

import MotionTextLink from '../motion_components/MotionTextLink';

const Footer = () => (
  <footer className='outer-container text-muted-foreground my-3 mt-12 py-3 text-sm lg:mb-16'>
    <div
      className='inner-container flex flex-col items-center justify-center gap-3 lg:max-w-2xl lg:flex-row lg:justify-between'
      data-role='footer'
    >
      <div className='flex' data-role='footer-contact-links'>
        {contactIconList.map((prop) => (
          <ContactLink key={prop.supportText} {...prop} />
        ))}
      </div>
      <div data-role='footer-copyright'>
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

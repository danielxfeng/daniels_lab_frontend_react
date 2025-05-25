import ContactLink from '@/components/shared/ContactLink';
import contactIconList from '@/constants/contactLinks';
import siteMeta from '@/constants/siteMeta';

/**
 * The Footer component.
 */
const Footer = () => (
  <footer className='outer-container text-primary py-6'>
    <div className='inner-container flex flex-col justify-center min-h-12 gap-3 lg:flex-row lg:justify-between'>
      <div>
        &copy; {siteMeta.copyRightYear} {siteMeta.siteName}
      </div>
      <div>
        Made by ❤️<em>{siteMeta.author}</em>❤️
      </div>
      <div className='flex gap-4'>
        {contactIconList.map((prop) => (
          <ContactLink key={prop.ariaLabel} {...prop} />
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;

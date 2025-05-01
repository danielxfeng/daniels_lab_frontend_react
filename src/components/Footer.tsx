import ContactLink from '@/components/ContactLink';
import contactIconList from '@/constants/contactLinks';
import siteMeta from '@/constants/siteMeta';

// The style for the contact icons
const contactIconStyle = 'h-6 w-6';

/**
 * The Footer component.
 */
const Footer = () => (
  <footer className='outer-container bg-gray-200'>
    <div className='inner-container flex flex-col justify-center gap-3 md:min-h-20 md:flex-row md:justify-between'>
      <div>
        &copy; {siteMeta.copyRightYear} {siteMeta.siteName}
      </div>
      <div>
        Made by ❤️<em>{siteMeta.author}</em>❤️
      </div>
      <div className='flex gap-4'>
        {contactIconList.map((prop) => (
          <ContactLink key={prop.ariaLabel} {...prop} className={contactIconStyle} />
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;

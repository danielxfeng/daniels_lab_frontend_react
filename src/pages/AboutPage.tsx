import { motion } from 'framer-motion';

import MotionH1 from '@/components/motion_components/MotionH1';
import ContactLink from '@/components/shared/ContactLink';
import contactIconList from '@/constants/contactLinks';
import siteMeta from '@/constants/siteMeta';
import { picAnimation } from '@/lib/animations';

const AboutPage = () => (
  <div className='inner-container flex flex-col-reverse items-center gap-8 lg:flex-row lg:justify-between lg:gap-16'>
    <title>{`About – ${siteMeta.siteName}`}</title>
    <div className='flex-1 space-y-6'>
      <MotionH1>About Me</MotionH1>
      <p className='text-foreground text-lg leading-relaxed'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac mauris in libero feugiat
        pulvinar at a nisl.
      </p>

      <p className='text-foreground text-lg leading-relaxed'>
        Vestibulum iaculis mi erat, nec lacinia eros aliquam id. Proin nec lorem dui. Nulla sagittis
        augue eu massa ultricies suscipit. Donec vestibulum aliquam quam, maximus fringilla lacus
        sodales vel. Fusce cursus tortor ipsum, nec rutrum nibh sollicitudin sed. Suspendisse ac
        malesuada orci. Integer gravida at ipsum at sodales. Sed urna erat, fermentum eget tristique
        at, dapibus sed enim. Cras ac euismod leo.
      </p>
      <h2>Contact</h2>
      <div className='flex gap-4 py-5'>
        {contactIconList.map((contact) => (
          <ContactLink
            key={contact.ariaLabel}
            Icon={contact.Icon}
            href={contact.href}
            ariaLabel={contact.ariaLabel}
            className='bg-primary text-background rounded-full p-3'
          />
        ))}
      </div>
    </div>
    <div>
      <motion.img
        src='/about-pic.jpeg'
        alt='Portrait of the author'
        {...picAnimation}
        className='w-[420px] rounded-2xl object-cover shadow-xl'
      />
    </div>
  </div>
);

export default AboutPage;

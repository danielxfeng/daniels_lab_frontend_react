import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logoImageMotion, logoTextMotion } from '@/lib/animations';

const Logo = () => (
  <Link to='/' className='flex items-end justify-start'>
    <motion.img src='/icon.png' alt='Logo light' className='h-16 w-16 dark:hidden' {...logoImageMotion} />
    <motion.img src='/icon-dark.png' alt='Logo dark' className='h-16 w-16 hidden dark:block' {...logoImageMotion} />
    <motion.span className='my-3 -ml-1 leading-none font-bold' {...logoTextMotion}>
      Fancy
      <br />
      Blog
    </motion.span>
  </Link>
);

export default Logo;

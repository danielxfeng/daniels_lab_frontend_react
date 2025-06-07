import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logoImageMotion } from '@/lib/animations';

const Logo = () => (
  <Link to='/' className='flex items-end justify-start'>
    <motion.img src='/icon.svg' alt='Logo light' className='h-12 dark:hidden' {...logoImageMotion} />
    <motion.img src='/icon-dark.svg' alt='Logo dark' className='h-12 hidden dark:block' {...logoImageMotion} />
  </Link>
);

export default Logo;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => (
  <Link to='/' className='flex items-end justify-start'>
    <motion.img
      src='/icon.png'
      alt='Logo'
      className='h-16 w-16'
      animate={{ x: 0, rotate: 0 }}
      whileHover={{ x: -12, rotate: -10 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 12,
      }}
    />
    <motion.span
      className='my-3 -ml-1 leading-none font-bold'
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      Fancy
      <br />
      Blog
    </motion.span>
  </Link>
);

export default Logo;

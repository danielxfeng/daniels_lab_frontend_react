import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import navMenu from '@/constants/navMenu';

const MotionNavLink = ({ title, link }: { title: string; link: string }) => (
  <motion.div whileHover='hover' initial='initial' className='relative'>
    <motion.div
      variants={{
        initial: {
          scale: 1,
          color: 'var(--color-foreground)',
        },
        hover: {
          scale: 1.1,
          color: 'var(--color-popover-foreground)',
        },
      }}
      transition={{
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.3,
      }}
    >
      <Link to={link} className='transition-all'>
        {title}
      </Link>
    </motion.div>

    <motion.div
      variants={{
        initial: { width: 0 },
        hover: { width: '100%' },
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className='absolute -bottom-1 left-0 h-[2px] bg-[var(--color-highlight)]'
    />
  </motion.div>
);

/**
 * One item in desktop menu.
 */
const NavList = ({ title, link }: { title: string; link: string }) => (
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <MotionNavLink title={title} link={link} />
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
);

/**
 * The full desktop nav component.
 */
const NavLinksDesktop = () => (
  <NavigationMenu className='hidden items-center md:flex'>
    {navMenu.map((item, i) => (
      <React.Fragment key={item.title}>
        {i > 0 && <span className='px-2'>|</span>}
        <NavList title={item.title} link={item.link} />
      </React.Fragment>
    ))}
  </NavigationMenu>
);

export default NavLinksDesktop;

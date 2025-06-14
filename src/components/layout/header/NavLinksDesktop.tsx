import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import navMenu from '@/constants/navMenu';
import { navTextAnimation, navUnderline } from '@/lib/animations';

const MotionNavLink = ({ title, link }: { title: string; link: string }) => (
  <motion.div
    whileHover='hover'
    initial='initial'
    className='text-primary relative'
    data-role='nav-link'
    aria-label='Navigation Link'
  >
    <motion.div {...navTextAnimation}>
      <Link to={link} className='hover:text-highlight transition-all duration-200'>
        {title}
      </Link>
    </motion.div>

    <motion.div
      variants={navUnderline}
      className='bg-highlight absolute -bottom-1 left-0 h-[2px]'
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
  <NavigationMenu
    className='hidden items-center lg:flex'
    data-role='nav-links-desktop'
    aria-label='Main Navigation Bar'
  >
    {navMenu.map((item, i) => (
      <React.Fragment key={item.title}>
        {i > 0 && <span className='text-ring px-2'>|</span>}
        <NavList title={item.title} link={item.link} />
      </React.Fragment>
    ))}
  </NavigationMenu>
);

export default NavLinksDesktop;

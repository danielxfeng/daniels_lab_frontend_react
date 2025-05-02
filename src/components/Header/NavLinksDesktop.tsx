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
import {  hoverOpacity, navUnderline, tapEffect, tweenTransition } from '@/lib/animations';

const MotionNavLink = ({ title, link }: { title: string; link: string }) => (
  <motion.div whileHover='hover' initial='initial' className='relative text-primary'>
    <motion.div
      whileHover={hoverOpacity}
      whileTap={tapEffect}
    >
      <Link to={link} className='transition-all'>
        {title}
      </Link>
    </motion.div>

    <motion.div
      variants={navUnderline}
      transition={tweenTransition}
      className='absolute -bottom-1 left-0 h-[2px] bg-primary'
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
        {i > 0 && <span className='px-2 text-ring'>|</span>}
        <NavList title={item.title} link={item.link} />
      </React.Fragment>
    ))}
  </NavigationMenu>
);

export default NavLinksDesktop;

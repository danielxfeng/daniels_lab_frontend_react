/**
 * @file This file contains the animation configurations for the application.
 */

import { ButtonVariant } from '@/components/motion_components/MotionButton';

/**
 * @constant logoImageMotion
 * @description Animation configuration for the logo image.
 */
const logoImageMotion = {
  animate: { rotate: 0 },
  whileHover: {
    rotate: 360,
    transition: { repeat: Infinity, duration: 0.8, ease: 'linear' },
  },
  transition: { type: 'spring', stiffness: 300, damping: 12 },
};

/**
 * @constant navUnderline
 * @description Animation configuration for the underline effect on navigation links.
 */
const navUnderline = {
  initial: { width: 0 },
  hover: { width: '100%', opacity: 0.8 },
};

/**
 * @constant tweenTransition
 * @description Animation configuration for the transition effect.
 */
const tweenTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};

/**
 * @constant springEffect
 * @description Spring effect configuration for animations.
 */
const springEffect = { type: 'spring', stiffness: 200, damping: 11 };

/**
 * @constant hoverEffect
 * @description Hover animation suitable for Icon buttons/links.
 */
const hoverEffect = { scale: 1.05, transition: tweenTransition };

/**
 * @constant hoverOpacity
 * @description Hover animation with opacity effect.
 */
const hoverOpacity = { opacity: 0.7, transition: springEffect };

/**
 * @constant tapEffect
 * @description Tap animation suitable for Icon buttons/links.
 */
const tapEffect = { scale: 0.95, transition: springEffect };

/**
 * @constant slideIn
 * @description Slide-in animation configuration.
 */
const slideIn = { initial: { opacity: 0, scale: 1.2 }, animate: { opacity: 1, scale: 1 } };

/**
 * @constant easeInOut
 * @description Animation configuration for the ease-in-out effect.
 */
const easeInOut = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: 'easeInOut' },
};

const picAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  whileHover: { scale: 1.02 },
  transition: tweenTransition,
};

const defaultShadowColor = '53, 98, 226'; // RGB for primary color
const destructiveShadowColor = '237, 59, 70'; // RGB for destructive color
const highlightShadowColor = '100, 200, 255'; // RGB for highlight color

const btnAnimation = (variant: ButtonVariant) => {
  let color;

  // Set shadow color based on the variant
  switch (variant) {
    case 'highlight':
      color = highlightShadowColor;
      break;
    case 'destructive':
      color = destructiveShadowColor;
      break;
    default:
      color = defaultShadowColor;
  }

  // Base infinite breathing glow animation (shared)
  const baseHover = {
    boxShadow: [
      `0 0 0px rgba(${color}, 0.5)`,
      `0 0 3px rgba(${color}, 0.7)`,
      `0 0 6px rgba(${color}, 0.9)`,
      `0 0 3px rgba(${color}, 0.7)`,
      `0 0 0px rgba(${color}, 0.5)`,
    ],
  };

  // Per-property breathing transition (shared)
  const baseTransition = {
    boxShadow: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  // Highlight variant
  if (variant === 'highlight') {
    return {
      initial: {
        boxShadow: `0 0 0px rgba(${color}, 0.5)`,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
      animate: {
        boxShadow: `0 0 0px rgba(${color}, 0.5)`,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
      whileHover: {
        ...baseHover,
        scale: 1.02,
        opacity: 0.9,
        transition: {
          ...baseTransition,
          scale: { duration: 0.5, ease: 'easeInOut' },
          opacity: { duration: 0.5, ease: 'easeInOut' },
        },
      },
      whileTap: {
        scale: 0.97,
        transition: { type: 'spring', stiffness: 600, damping: 40 },
      },
    };
  }

  // Other variants (primary, destructive)
  return {
    initial: {
      boxShadow: `0 0 0px rgba(${color}, 0.5)`,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    animate: {
      boxShadow: `0 0 0px rgba(${color}, 0.5)`,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    whileHover: {
      ...baseHover,
      transition: baseTransition,
    },
    whileTap: {
      scale: 0.98,
      transition: { type: 'spring', stiffness: 600, damping: 40 },
    },
  };
};

const loaderAnimation = {
  animate: {
    rotate: 360,
    scale: [1, 1.05, 1],
    opacity: [1, 0.85, 1],
  },
  transition: {
    rotate: { repeat: Infinity, duration: 1.2, ease: 'linear' },
    scale: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
    opacity: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
};

export {
  logoImageMotion,
  navUnderline,
  tweenTransition,
  hoverEffect,
  hoverOpacity,
  tapEffect,
  springEffect,
  easeInOut,
  picAnimation,
  slideIn,
  btnAnimation,
  loaderAnimation,
};

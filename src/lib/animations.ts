/**
 * @file This file contains the animation configurations for the application.
 */

import { easeInOut, Easing } from 'framer-motion';

import { ButtonVariant } from '@/components/motion_components/MotionButton';

/**
 * @constant logoImageMotion
 * @description Animation configuration for the logo image.
 */
const logoImageMotion = {
  whileHover: {
    scale: 1.01,
    filter: [
      'brightness(100%)',
      'brightness(120%)',
      'brightness(150%)',
      'brightness(120%)',
      'brightness(100%)',
    ],
    transition: {
      type: 'tween',
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
  whileTap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 200, damping: 11 },
  },
};

/**
 * @constant navUnderline
 * @description Animation configuration for the underline effect on navigation links.
 */
const navUnderline = {
  initial: { width: 0, opacity: 0 },
  hover: {
    width: '100%',
    opacity: 1,
    transition: {
      type: 'tween',
      ease: easeInOut,
      duration: 0.4,
    },
  },
};

/**
 * @constant draggableAnimation
 * @description Animation configuration for draggable elements.
 */
const draggableAnimation = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { type: 'tween', ease: easeInOut, duration: 0.4 },
};

/**
 * @constant navTextAnimation
 */
const navTextAnimation = {
  whileHover: {
    scale: 1.02,
    transition: {
      type: 'tween',
      ease: easeInOut,
      duration: 0.6,
    },
  },
  whileTap: { scale: 0.95, transition: { type: 'spring', stiffness: 200, damping: 11 } },
};

/**
 * @constant myEaseInOut
 * @description Animation configuration for the ease-in-out effect.
 */
const classEaseInOut = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: easeInOut },
};

const h1Animation = {
  initial: { opacity: 0, scale: 1.2 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0, 0, 1, 1] as Easing },
};

const postCardAnimation = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 14,
    },
  },
  whileTap: { scale: 0.98, transition: { type: 'spring', stiffness: 200, damping: 11 } },
};

// The animation for the link component
const linkAnimation = {
  whileHover: {
    scale: 1.05,
    transition: {
      type: 'tween',
      ease: easeInOut,
      duration: 0.4,
    },
  },
  whileTap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 200, damping: 11 },
  },
};

// The animation for the picture component
const picAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  whileHover: { scale: 1.02 },
  transition: {
    type: 'tween',
    ease: easeInOut,
    duration: 0.4,
  },
};

// The animation for the avatar component
const avatarAnimation = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
  },
  whileHover: {
    opacity: 0.7,
    transition: {
      opacity: { duration: 0.5, ease: easeInOut },
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const defaultShadowColor = '53, 98, 226'; // RGB for primary color
const destructiveShadowColor = '237, 59, 70'; // RGB for destructive color
const highlightShadowColor = '100, 200, 255'; // RGB for highlight color

// The animation for the button component
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
      ease: [0, 0, 1, 1] as Easing,
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
        scale: [1, 1.01, 1.02, 1.01, 1],
        opacity: 0.9,
        transition: {
          ...baseTransition,
          scale: { duration: 1.8, repeat: Infinity, ease: [0, 0, 1, 1] as Easing },
          opacity: { duration: 0.5, ease: easeInOut },
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

// The animation for the loader component
const loaderAnimation = {
  animate: {
    rotate: 360,
    scale: [1, 1.05, 1],
    opacity: [1, 0.85, 1],
  },
  transition: {
    rotate: { repeat: Infinity, duration: 1.2, ease: [0, 0, 1, 1] as Easing },
    scale: { repeat: Infinity, duration: 2.5, ease: easeInOut },
    opacity: { repeat: Infinity, duration: 2.5, ease: easeInOut },
  },
};

// The animation for fade-in effects
const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay: 0.3, ease: easeInOut },
};

// The animation for span elements
const spanAnimation = (index: number, delay: number = 0.03) => ({
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: index * delay,
        duration: 0.3,
      },
    },
  },
});

const blurCardAnimation = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
    y: 40,
    scale: 1.1,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
  },
  transition: {
    duration: 2.0,
    ease: [0.25, 1, 0.5, 1] as Easing,
  },
};

export {
  avatarAnimation,
  blurCardAnimation,
  btnAnimation,
  classEaseInOut,
  draggableAnimation,
  fadeInAnimation,
  h1Animation,
  linkAnimation,
  loaderAnimation,
  logoImageMotion,
  navTextAnimation,
  navUnderline,
  picAnimation,
  postCardAnimation,
  spanAnimation,
};

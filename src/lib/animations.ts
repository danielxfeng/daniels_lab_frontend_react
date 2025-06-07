/**
 * @file This file contains the animation configurations for the application.
 */

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

const btnAnimation = {
  whileHover: {
    opacity: [0.8, 0.86, 0.92, 0.84, 0.8],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  whileTap: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  },
};

const btnPrimaryAnimation = {
  whileHover: {
    scale: 1.015,
    opacity: 0.95,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
  },
  whileTap: {
    scale: 0.98,
  },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
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
  btnPrimaryAnimation,
  loaderAnimation,
};

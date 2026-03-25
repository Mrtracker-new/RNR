import { useReducedMotion, Variants } from 'framer-motion';

/**
 * Returns reduced-motion-safe variants when the user has requested
 * "Reduce Motion" in their OS accessibility settings.
 *
 * Usage:
 *   const variants = useAccessibleVariants(myVariants);
 *   <motion.div variants={variants} initial="hidden" animate="visible" />
 */
export const useAccessibleVariants = (variants: Variants): Variants => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
    };
  }

  return variants;
};

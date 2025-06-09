// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMotionTemplate, useMotionValue, motion } from 'motion/react';
import { Input } from '../ui/input';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * @summary StyledInput is a custom input component that provides a hover effect.
 * @details
 * The hover effect is inspired from:
 * https://ui.aceternity.com/components/signup-form
 *
 * @param - `isError` - boolean to indicate if the input is in error state.
 *
 * @remarks
 * The idea is to wrap the `input` inside a `motion.div`,
 * and draw a radial background based on the mouse position.
 * Since the input covers most of the container,
 * only the outer part of the gradient remains visible,
 * which looks a border effect.
 */
const StyledInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100; // The radius of the circle
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
              var(--highlight),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='group/input rounded-xl p-[2px] transition duration-300'
      >
        <Input
          type={type}
          className={cn(
            `border-border bg-background focus-visible:ring-border dark:bg-background flex h-10 w-full rounded-lg text-sm transition duration-400 group-hover/input:shadow-none focus-visible:ring-[2px]`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
StyledInput.displayName = 'Input';

export default StyledInput;

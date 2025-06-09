import MotionHoverWrapper from '@/components/motion_components/MotionHoverWrapper';
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// An wrapped input component to provide a hover effect.
const MotionInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <MotionHoverWrapper>
        <Input
          type={type}
          className={cn(
            'border-border bg-background focus-visible:ring-border dark:bg-background flex h-10 w-full rounded-lg text-sm transition duration-400 group-hover/input:shadow-none focus-visible:ring-[2px]',
            className,
          )}
          ref={ref}
          {...props}
        />
      </MotionHoverWrapper>
    );
  },
);
MotionInput.displayName = 'MotionInput';

export default MotionInput;

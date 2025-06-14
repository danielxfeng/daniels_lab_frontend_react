import React from 'react';

import MotionHoverWrapper from '@/components/motion_components/MotionHoverWrapper';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// An wrapped textarea component to provide a hover effect.
const MotionTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <MotionHoverWrapper>
      <Textarea
        className={cn(
          'border-border bg-background focus-visible:ring-border dark:bg-background flex w-full rounded-lg text-sm transition duration-400 group-hover/input:shadow-none focus-visible:ring-[2px]',
          className,
        )}
        ref={ref}
        {...props}
      />
    </MotionHoverWrapper>
  );
});
MotionTextarea.displayName = 'MotionTextarea';

export default MotionTextarea;

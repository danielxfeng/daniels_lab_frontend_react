import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// This is to define a pre-styled input component
const StyledInput = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <Input
      type={type}
      className={cn(
        'bg-background ring-border/20 focus-within:ring-primary h-8 rounded-lg border-none px-3.5 text-sm shadow-inner ring-1 ring-inset focus-within:ring-2',
        className,
      )}
      {...props}
    />
  );
};

export default StyledInput;

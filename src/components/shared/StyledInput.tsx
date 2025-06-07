import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// This is to define a pre-styled input component
const StyledInput = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <Input
      type={type}
      className={cn(
        'bg-background ring-border/20 focus-within:ring-primary hover:ring-border/40 h-10 rounded-lg border-none px-4 text-sm shadow-inner ring-1 transition-colors duration-200 ring-inset focus-within:ring-2',
        className,
      )}
      {...props}
    />
  );
};

export default StyledInput;

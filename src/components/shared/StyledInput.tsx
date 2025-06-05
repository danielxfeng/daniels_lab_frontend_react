import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// This is to define a pre-styled input component
const StyledInput = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <Input type={type} className={cn('', className)} {...props} />
  );
};

export default StyledInput;

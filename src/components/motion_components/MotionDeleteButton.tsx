import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import MotionIconButton from '@/components/motion_components/MotionIconButton';

type MotionDeleteButtonProps = {
  toDelete: string;
  tooltip: string;
  deleteHandler: () => void;
  size?: string;
  isLoading?: boolean;
  className?: string;
};

/**
 * @summary A delete button with a confirmation dialog.
 * @param - toDelete - The name of the item to be deleted, displayed in the confirmation dialog.
 * @param - tooltip - The tooltip text for the button, also used as the aria-label.
 * @param - deleteHandler - The function to call when the user confirms deletion.
 * @param - size - The size of the icon, defaults to `h-6 w-6`.
 * @param - isLoading - Whether the button is in a loading state, which disables the button and prevents interaction, defaults to false.
 * @param - className - Optional additional classes for styling the button, defaults to 'text-destructive'.
 */
const MotionDeleteButton = ({
  toDelete,
  tooltip,
  deleteHandler,
  size = 'h-6 w-6',
  isLoading = false,
  className = 'text-destructive',
}: MotionDeleteButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <MotionIconButton
          icon={<Trash2 className={size} />}
          ariaLabel={tooltip}
          type='button'
          disabled={isLoading}
          isLoading={isLoading}
          className={className}
          tooltip={tooltip}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:{'  '}
            <span className='text-destructive'>{toDelete}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='text-muted-foreground' disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteHandler}
            disabled={isLoading}
            className='bg-destructive hover:bg-destructive'
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MotionDeleteButton;

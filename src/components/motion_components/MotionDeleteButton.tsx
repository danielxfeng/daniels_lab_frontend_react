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
import MotionButton, {
  ButtonSize,
  ButtonVariant,
} from '@/components/motion_components/MotionButton';

type MotionDeleteButtonProps = {
  deleteItem: string;
  supportingText: string;
  deleteHandler: () => void;
  textOrIcon: 'text' | 'icon' | 'mixed';
  size: ButtonSize;
  isLoading: boolean;
  variant?: ButtonVariant;
};

const getTextIcon = (textOrIcon: 'text' | 'icon' | 'mixed') => {
  switch (textOrIcon) {
    case 'text':
      return { text: 'Delete' };
    case 'icon':
      return { icon: <Trash2 /> };
    case 'mixed':
      return { text: 'Delete', icon: <Trash2 /> };
    default:
      return null;
  }
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
const MotionDeleteButton = (props: MotionDeleteButtonProps) => {
  const btnVariant = props.variant || 'destructive';
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <MotionButton
          buttonType='button'
          variant={btnVariant}
          supportingText={props.supportingText}
          size={props.size}
          {...getTextIcon(props.textOrIcon)}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:{'  '}
            <span className='text-destructive'>{props.deleteItem}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='text-muted-foreground' disabled={props.isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={props.deleteHandler}
            disabled={props.isLoading}
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

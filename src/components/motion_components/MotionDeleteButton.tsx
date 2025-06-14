import { Trash2 } from 'lucide-react';

import MotionButton, {
  ButtonSize,
  ButtonVariant,
} from '@/components/motion_components/MotionButton';
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

type MotionDeleteButtonProps = {
  deleteItem: string;
  supportingText: string;
  deleteHandler: () => void;
  textOrIcon: 'text' | 'icon' | 'mixed';
  size: ButtonSize;
  isLoading: boolean;
  variant?: ButtonVariant;
  btnClass?: string;
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
 * @param - deleteItem - The name of the item to be deleted, displayed in the confirmation dialog.
 * @param - supportingText - The tooltip text for the button, also used as the aria-label.
 * @param - deleteHandler - The function to call when the user confirms deletion.
 * @param - textOrIcon - Determines whether to display text, an icon, or both in the button. Options are 'text', 'icon', or 'mixed'.
 * @param - size - The size of the icon, defaults to `h-6 w-6`.
 * @param - isLoading - Whether the button is in a loading state, which disables the button and prevents interaction, defaults to false.
 * @param - variant - The button variant, which determines the styling of the button. Defaults to 'destructive'.
 * @param - btnClass - Additional CSS classes to apply to the button.
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
          <AlertDialogTitle className='text-primary'>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:{'  '}
            <span className='text-destructive'>{props.deleteItem}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='text-muted-foreground hover:bg-foreground/5 easeInOut border bg-transparent transition-colors duration-150'
            disabled={props.isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={props.deleteHandler}
            disabled={props.isLoading}
            className='border-destructive text-destructive hover:bg-destructive/15 easeInOut border bg-transparent transition-colors duration-150'
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MotionDeleteButton;

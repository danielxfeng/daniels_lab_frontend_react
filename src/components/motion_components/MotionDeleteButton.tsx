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
  dataRole: string;
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
          dataRole={props.dataRole}
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
            className='text-muted-foreground hover:bg-foreground/5 border bg-transparent transition-colors duration-150 ease-in-out'
            disabled={props.isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={props.deleteHandler}
            disabled={props.isLoading}
            className='border-destructive text-destructive hover:bg-destructive/15 border bg-transparent transition-colors duration-150 ease-in-out'
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MotionDeleteButton;

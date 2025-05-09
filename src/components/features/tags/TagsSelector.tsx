import { useFormContext, Controller } from 'react-hook-form';
import DragDropComponent from '@/components/features/tags/dragDropComponent';
import TagInputComponent from '@/components/features/tags/TagInputComponent';

/**
 * @summary A multi-select tag input component.
 * @description
 * There is 2 parts:
 * 1. The input field.
 * 2. The drag and drop container.
 */
const TagSelector = ({ name }: { name: string }) => {
  const { control, watch } = useFormContext();
  const tags = watch(name) || [];

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <div className='space-y-2'>
          {/* Drag and drop container */}
          <DragDropComponent name={name} tags={tags} />
          {/* Input field with a suggestion dropdown */}
          <TagInputComponent name={name} tags={tags} />
        </div>
      )}
    />
  );
};

export default TagSelector;

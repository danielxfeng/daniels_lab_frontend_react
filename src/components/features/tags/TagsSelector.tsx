import { useFormContext, Controller } from 'react-hook-form';
import TagInputComponent from '@/components/features/tags/TagInputComponent';
import DragDropComponent from '@/components/features/tags/DragDropComponent';

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
        <div className='space-y-2 gap-2 flex flex-col'>
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

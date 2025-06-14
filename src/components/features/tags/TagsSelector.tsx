import { ControllerRenderProps } from 'react-hook-form';

import DragDropComponent from '@/components/features/tags/DragAndDropComponent';
import TagInputComponent from '@/components/features/tags/TagInputComponent';
import { CreateOrUpdatePostBody } from '@/schema/schema_post';

/**
 * @summary A multi-select tag input component.
 * @description
 * There is 2 parts:
 * 1. The input field.
 * 2. The drag and drop container.
 */
const TagSelector = ({
  field,
  inputId,
}: {
  field: ControllerRenderProps<CreateOrUpdatePostBody, 'tags'>;
  inputId: string;
}) => {
  return (
    <div className='flex flex-col gap-2 space-y-2'>
      {/* Drag and drop container */}
      <DragDropComponent field={field} />
      {/* Input field with a suggestion dropdown */}
      <TagInputComponent field={field} inputId={inputId} />
    </div>
  );
};

export default TagSelector;

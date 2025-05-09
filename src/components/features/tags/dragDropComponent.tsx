import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// Draggable: A tag
const DraggableTag = ({ tag }: { tag: string }) => {
  // As a draggable, we use `useDraggable` to get the attributes and listeners for the tag
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: tag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 200ms ease',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className='bg-muted flex items-center gap-2 rounded-full px-3 py-1 text-sm shadow'
    >
      <span>{tag}</span>
    </motion.div>
  );
};

// Droppable: The trash zone
const DroppableTrash = () => {
  // As a droppable, we use `useDroppable` to get the ref trash zone
  const { setNodeRef } = useDroppable({ id: 'trash' });

  return (
    <AnimatePresence>
      <motion.div
        ref={setNodeRef}
        id='trash'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='bg-destructive fixed bottom-4 left-1/2 z-50 h-16 w-full -translate-x-1/2 rounded-xl px-6 py-3 text-white shadow-xl'
      >
        Drop here to delete
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * @summary The Drag and Drop component.
 * @description
 * The component is a container managed by DNDContext.
 * It manages 2 areas:
 *  - The TagsContainer, which contains all the `draggable`(tags).
 *    - The container also handles the drag events.
 *    - There are 3 events:
 *      - `onDragStart`: when the user starts dragging a tag.
 *      - `onDragOver`: when the user is dragging a tag over something
 *      - `onDragEnd`: when the user drops the tag.
 *    - The TrashZone, which is a `droppable` area.
 */
const DragDropComponent = ({
  name,
  tags, // The tags in the container
}: {
  name: string;
  tags: string[];
}) => {
  // Use this hook to toggle the Display of the trash zone.
  const [dragging, setDragging] = useState(false);
  // Use this hook to set the CSS when flying over the trash zone.
  const [isOverTrash, setIsOverTrash] = useState(false);

  const { setValue } = useFormContext();

  // Handler for starting a drag, for setting the dragging state.
  const handleDragStart = () => {
    setDragging(true);
  };

  // Switch the flag when the tag is over the trash zone.
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const overId = over?.id as string | null;
    if (overId === 'trash' && !isOverTrash) setIsOverTrash(true);
    if (overId !== 'trash' && isOverTrash) setIsOverTrash(false);
  };

  // Handler for dropping a tag
  const handleDragEnd = (event: DragEndEvent) => {
    setIsOverTrash(false);
    setDragging(false);
    const { active, over } = event;
    // The tag we are dragging.
    const activeId = active.id as string;
    console.log('[dragging]', activeId, 'over', over?.id);
    // Id of the dropped area. Null if outside the controlled area.
    const overId = over?.id as string | null;

    // If the tag is not at the trash zone, do nothing.
    if (!overId || overId !== 'trash') return;

    // Remove it from the list.
    setValue(
      name,
      tags.filter((tag) => tag !== activeId),
    );
  };

  return (
    <DndContext
      collisionDetection={closestCenter} // How to detect an `Over`.
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* The tags container */}
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <DraggableTag key={tag} tag={tag} />
        ))}
      </div>

      {/* The trash zone */}
      {dragging && <DroppableTrash />}
    </DndContext>
  );
};

export default DragDropComponent;

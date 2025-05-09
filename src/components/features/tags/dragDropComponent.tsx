import { springEffect } from '@/lib/animations';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
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
      className='inline-flex items-center justify-center whitespace-nowrap
                 w-auto max-w-full bg-muted text-muted-foreground
                 gap-2 rounded-full px-3 py-1 text-sm shadow pointer-events-auto'
    >
      <span>{tag}</span>
    </motion.div>
  );
};

// Droppable: The trash zone
const DroppableTrash = ({ dragging }: { dragging: boolean }) => {
  // As a droppable, we use `useDroppable` to get the ref trash zone
  const { isOver, setNodeRef } = useDroppable({ id: 'trash' });

  return (
    <AnimatePresence>
      {dragging && (
        <motion.div
          ref={setNodeRef}
          id='trash'
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springEffect}
          className={cn(
            'mx-auto mt-4 w-11/12 max-w-md rounded-xl border-2 border-dashed px-6 py-4 text-center text-sm transition-all',
            'pointer-events-none backdrop-blur-sm select-none',
            isOver
              ? 'bg-destructive/60 border-destructive scale-105 text-white'
              : 'bg-destructive/10 text-destructive scale-100',
          )}
        >
          Drop here to delete
        </motion.div>
      )}
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
      collisionDetection={pointerWithin} // How to detect an `Over`.
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* The trash zone */}
      <DroppableTrash dragging={dragging} />

      {/* The tags container */}
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <DraggableTag key={tag} tag={tag} />
        ))}
      </div>
    </DndContext>
  );
};

export default DragDropComponent;

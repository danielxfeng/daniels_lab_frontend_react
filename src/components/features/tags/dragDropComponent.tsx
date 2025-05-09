import { springEffect } from '@/lib/animations';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// Draggable: A tag
const DraggableTag = ({ tag, isOverlay = false }: { tag: string; isOverlay?: boolean }) => {
  // As a draggable, we use `useDraggable` to get the attributes and listeners for the tag
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: tag });

  // The animation is disabled when the tag is being `overlay-ed`
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isOverlay ? 'none' : 'transform 200ms ease',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout={!isOverlay} // Only animate when not overlaying
      className='bg-muted text-muted-foreground pointer-events-auto z-10 inline-flex w-auto max-w-[160px] items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-1 text-sm text-ellipsis whitespace-nowrap shadow'
    >
      <span>{tag}</span>
    </motion.div>
  );
};

// Droppable: The trash zone
const DroppableTrash = ({ dragging }: { dragging: boolean }) => {
  // Always use the hook inside the component
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
  //const [dragging, setDragging] = useState(false);
  // To determine which tag is being dragged
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { setValue } = useFormContext();

  // Handler for starting a drag, for setting the dragging state.
  const handleDragStart = (event: DragStartEvent) => {
    //setDragging(true);
    setActiveTag(event.active.id as string);
  };

  // Switch the flag when the tag is over the trash zone.
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    void over;
  };

  // Handler for dropping a tag
  const handleDragEnd = (event: DragEndEvent) => {
    //setDragging(false);
    const { active, over } = event;
    // The tag being dragged
    const activeId = active.id as string;
    // The object being dragged over, null if not over any controlled area
    const overId = over?.id as string | null;

    // We only handle when the tag is dropped over the trash zone
    if (overId === 'trash') {
      setValue(
        name,
        tags.filter((tag) => tag !== activeId),
      );
    }

    // Reset the active tag
    setActiveTag(null);
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* The trash zone */}
      <DroppableTrash dragging={!!activeTag} />

      {/* The tags container */}
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (tag === activeTag ? null : <DraggableTag key={tag} tag={tag} />))}
      </div>

      {/* DND maintains a clone when a tas is dragging */}
      <DragOverlay>{activeTag ? <DraggableTag tag={activeTag} isOverlay /> : null}</DragOverlay>
    </DndContext>
  );
};

export default DragDropComponent;

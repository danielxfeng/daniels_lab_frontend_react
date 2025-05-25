import { tweenTransition } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { CreateOrUpdatePostBody } from '@/schema/schema_post';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  DragMoveEvent,
} from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

// Draggable: A tag
const DraggableTag = ({ tag, isOverlay = false }: { tag: string; isOverlay?: boolean }) => {
  // As a draggable, we use `useDraggable` to get the attributes and listeners for the tag
  const { attributes, listeners, setNodeRef } = useDraggable({ id: tag });

  return (
    <motion.div
      ref={setNodeRef}
      style={{ opacity: isOverlay ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      className={cn(
        'border-muted-foreground bg-background text-muted-foreground pointer-events-auto z-10 inline-flex w-auto max-w-[160px] items-center justify-center gap-2 overflow-hidden rounded-xl border px-3 py-1 text-sm text-ellipsis whitespace-nowrap shadow transition-colors',
        isOverlay && 'bg-destructive text-background',
      )}
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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={tweenTransition}
          className={cn(
            'absolute -top-28 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-xl border-2 border-dashed px-6 py-6 text-center text-sm transition-all',
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
  field,
}: {
  field: ControllerRenderProps<CreateOrUpdatePostBody, 'tags'>;
}) => {
  // To determine which tag is being dragged
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTagMoving, setActiveTagMoving] = useState<string | null>(null);

  // Long press to drag for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  // Handler for starting a drag, for setting the active tag.
  const handleDragStart = (event: DragMoveEvent) => {
    setActiveTag(event.active.id as string);
  };

  // Handler for moving a drag, for updating the ui.
  const handleDragMove = (event: DragMoveEvent) => {
    const { delta } = event;
    if (!activeTagMoving && (Math.abs(delta.x) > 5 || Math.abs(delta.y) > 5))
      setActiveTagMoving(event.active.id as string);
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
      const tags = field.value || [];
      field.onChange(tags.filter((tag) => tag !== activeId));
      field.onBlur();
    }

    // Reset the active tag, next tick:)
    setTimeout(() => {
      setActiveTag(null);
      setActiveTagMoving(null);
    }, 1);
  };

  const tags = field.value || [];

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className='relative'>
        {/* The trash zone */}
        <DroppableTrash dragging={!!activeTag} />
        {/* The tags container */}
        <div className='flex flex-wrap gap-2 p-2'>
          {tags.map((tag) =>
            tag === activeTagMoving ? null : (
              // This layer is for other tags, which takes the dragging tag's place
              <motion.div
                key={tag}
                layout
                transition={{ layout: { duration: 0.5, ease: 'easeInOut' } }}
              >
                <DraggableTag key={tag} tag={tag} />
              </motion.div>
            ),
          )}
        </div>
      </div>

      {/* DND maintains a clone when a tag is dragging */}
      <DragOverlay>{activeTag ? <DraggableTag tag={activeTag} isOverlay /> : null}</DragOverlay>
    </DndContext>
  );
};

export default DragDropComponent;

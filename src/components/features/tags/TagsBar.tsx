import MotionButton from '@/components/motion_components/MotionButton';

/**
 * @summary The TagsBar component displays a list of tags.
 * @param tags - The tags to display.
 * @returns A React component that displays a list of tags.
 */
const TagsBar = ({ tags }: { tags: string[] }) => {
  if (!tags || tags.length === 0) {
    return null; // Return null if there are no tags to display
  }
  return (
    <div className='flex items-center gap-2'>
      <div className='mr-2'>Tags:</div>
      <div className='flex flex-wrap items-center gap-1.5'>
        {tags.map((tag) => (
          <MotionButton
            variant='tag'
            size='sm'
            supportingText={`to posts with tag ${tag}`}
            key={tag}
            to={`/blog/posts/?tags=${tag}`}
            text={`${tag}`}
            isExternal={false}
          />
        ))}
      </div>
    </div>
  );
};

export default TagsBar;

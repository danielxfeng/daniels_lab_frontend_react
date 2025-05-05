import MotionTextButtonLink from '../motion_components/MotionTextButtonLink';

/**
 * @summary The TagsBar component displays a list of tags.
 * @param tags - The tags to display.
 * @returns A React component that displays a list of tags.
 */
const TagsBar = ({ tags }: { tags: string[] }) => (
  <div className='flex flex-wrap items-center gap-1.5'>
    <span className='mr-2'>Tags:</span>
    {tags.map((tag) => (
      <MotionTextButtonLink
        to={`/blog/posts/?tags=${tag}`}
        label={`${tag}`}
        ariaLabel={`to posts with tag ${tag}`}
        className='bg-highlight rounded-md px-2 py-0.5 text-sm'
        isExternal={false}
      />
    ))}
  </div>
);

export default TagsBar;

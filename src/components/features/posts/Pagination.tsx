import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import siteMeta from '@/constants/siteMeta';
import MotionIconLink from '@/components/motion_components/MotionIconLink';

/**
 * A custom pagination component for navigating through pages of content.
 * @param total - The total number of items.
 * @param offset - The current offset.
 * @param isPrevEnabled - A flag to enable or disable the previous button.
 * @returns A pagination component.
 */
const Pagination = ({
  total,
  offset,
  isPrevEnabled = true,
}: {
  total: number;
  offset: number;
  isPrevEnabled: boolean;
}) => {
  const [searchParams] = useSearchParams();

  const limit = siteMeta.paginationLimit;
  const currentOffset = offset;

  // The condition of the previous button
  const hasPrevious = currentOffset > 0 && isPrevEnabled;
  // The condition of the next button
  const hasNext = currentOffset + limit < total;

  // Set the base URL parameters for pagination
  const getBaseParams = () => {
    const base = new URLSearchParams(searchParams);
    base.delete('offset');
    base.set('limit', limit.toString());
    return base;
  };

  // Assemble the URL parameters for prev
  const goToPrev = (): string => {
    const base = getBaseParams();
    const newOffset = Math.max(0, currentOffset - limit);
    base.set('offset', newOffset.toString());
    return `?${base.toString()}`;
  };

  // Assemble the URL parameters for next
  const goToNext = (): string => {
    const base = getBaseParams();
    const newOffset = currentOffset + limit;
    base.set('offset', newOffset.toString());
    return `?${base.toString()}`;
  };

  return (
    <nav className='mx-auto flex items-center gap-8 py-2'>
      {hasPrevious && (
        <MotionIconLink
          to={goToPrev()}
          icon={
            <>
              <span className='hidden lg:block'>Prev ...</span>
              <ChevronLeftIcon className='text-foreground/80 h-8 w-8' />
            </>
          }
          ariaLabel='navigate to previous page'
          isExternal={false}
          className='hover:bg-muted/90'
          tooltip='Previous Page'
        />
      )}
      {hasNext && (
        <MotionIconLink
          to={goToNext()}
          icon={
            <>
              <ChevronRightIcon className='text-foreground/80 h-8 w-8' />{' '}
              <span className='hidden lg:block'>Next ...</span>
            </>
          }
          ariaLabel='navigate to next page'
          isExternal={false}
          className='hover:bg-muted'
          tooltip='Next Page'
        />
      )}
    </nav>
  );
};

export default Pagination;

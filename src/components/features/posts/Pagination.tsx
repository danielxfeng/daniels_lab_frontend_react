import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import siteMeta from '@/constants/siteMeta';
import MotionButton from '@/components/motion_components/MotionButton';

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
        <MotionButton
          supportingText='Previous Page'
          variant='ghost'
          size='sm'
          to={goToPrev()}
          icon={<ChevronLeftIcon />}
          text='Prev ...'
          isExternal={false}
          textClass='hidden lg:block'
          btnClass='border-none'
        />
      )}
      {hasNext && (
        <MotionButton
          supportingText='Next Page'
          variant='ghost'
          size='sm'
          to={goToNext()}
          icon={<ChevronRightIcon />}
          text='... Next'
          isExternal={false}
          textClass='hidden lg:block'
          btnClass='border-none'
        />
      )}
    </nav>
  );
};

export default Pagination;

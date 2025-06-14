// This is a loading spinner, to be used in a page or div.
const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/50'>
      <div className='border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
    </div>
  );
};

export default Loading;

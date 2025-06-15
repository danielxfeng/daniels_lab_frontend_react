const FeaturedPosts = () => {
  return (
    <div className='mt-10'>
      <h2 className='mb-4 text-2xl font-bold'>Featured Posts</h2>
      {/* Example featured posts */}
      <div className='space-y-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h3 className='text-xl font-semibold'>Post Title 1</h3>
          <p className='text-gray-600'>Excerpt of post 1.</p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h3 className='text-xl font-semibold'>Post Title 2</h3>
          <p className='text-gray-600'>Excerpt of post 2.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
const ProjectCards = () => {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {/* Example project cards */}
      <div className='rounded-lg bg-white p-4 shadow'>
        <h2 className='text-xl font-semibold'>Project 1</h2>
        <p className='text-gray-600'>Description of project 1.</p>
      </div>
      <div className='rounded-lg bg-white p-4 shadow'>
        <h2 className='text-xl font-semibold'>Project 2</h2>
        <p className='text-gray-600'>Description of project 2.</p>
      </div>
      <div className='rounded-lg bg-white p-4 shadow'>
        <h2 className='text-xl font-semibold'>Project 3</h2>
        <p className='text-gray-600'>Description of project 3.</p>
      </div>
    </div>
  );
};

export default ProjectCards;

const ThemeToggle = () => {
  return (
    <div className='flex items-center'>
      <input
        type='checkbox'
        id='theme-toggle'
        className='hidden'
      />
      <label
        htmlFor='theme-toggle'
        className='cursor-pointer flex items-center'
      >
        <span className='mr-2'>🌙</span>
        <span className='text-gray-700'>Dark Mode</span>
      </label>
    </div>
  );
}
export default ThemeToggle;
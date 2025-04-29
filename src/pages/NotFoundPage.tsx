import { useLocation, Link } from 'react-router-dom';

// 404 page.
const NotFoundPage = () => {
  const location = useLocation();
  console.warn('404 warning', location.pathname);
  return (
    <>
      <h1>Oops! Page not found.</h1>

      <p>The page "{location.pathname}" does not exist.</p>

      {/** Link to go back to home. */}
      <Link to='/'>Go back to home</Link>
    </>
  );
};

export default NotFoundPage;

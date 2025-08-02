import { redirect } from 'react-router';

const clientLoader = async () => {
  return redirect('/blog/posts');
};

const BlogRedirect = () => {
  return null; // This component is just a redirect handler
};

export default BlogRedirect;

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };

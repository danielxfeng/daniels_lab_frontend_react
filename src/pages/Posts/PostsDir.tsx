import { redirect } from 'react-router';

const clientLoader = async () => {
  return redirect('/blog/posts');
};

const PostsDir = () => {
  return null; // This component is just a redirect handler
};

export default PostsDir;

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };

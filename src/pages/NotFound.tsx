import { data } from 'react-router';

const clientLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  throw data(`${url} Not Found`, { status: 404 });
};

const NotFound = () => null;

export default NotFound;

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };

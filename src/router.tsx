import { createBrowserRouter } from 'react-router-dom';

import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Oops! Something went wrong.</div>,
  },
]);

export { router };

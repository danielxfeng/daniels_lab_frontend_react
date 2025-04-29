import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import NotFoundPage from '@/pages/NotFoundPage';

// The router of the app.
const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      // The index page of `/`.
      { index: true, Component: () => <div>Home</div> },
      { path: 'about', Component: () => <div>About</div> },
      {
        // /users
        path: 'users',
        children: [{ index: true, Component: () => <div>Users</div> }],
      },

      // Fallback, 404 page.
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);

export { router };

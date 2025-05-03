import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorBoundary from '@/pages/ErrorBoundary';
import TermsPage from '@/pages/TermsPage';
import AboutPage from './pages/AboutPage';

// The router of the app.
const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      // /
      // Homepage, hero
      { index: true, Component: () => <div>Home</div> },
      // /blog
      {
        path: 'blog',
        children: [
          // posts list, a button to new post
          // side bar with filters, a list of hot tags
          // todo loader
          { index: true, Component: () => <div>Blog</div> },
          {
            path: 'posts',
            children: [
              // posts list, a button to new post
              // side bar with filters, a list of hot tags
              // todo loader
              { index: true, Component: () => <div>Blog Posts</div> },
              // posts list for search results
              // side bar with filters, a list of hot tags
              // todo loader
              { path: 'search', Component: () => <div>Blog Search</div> },
              // post detail, comments list, like status
              // a button to new/edit/delete a post
              // a form to add/edit/delete a comment
              // a bottom to like/unlike a post
              // share buttons
              // todo loader
              // todo action
              { path: ':id', Component: () => <div>Blog Post</div> },
              // a form to add a post.
              // a combo box to add/select tags
              // shared components with edit post
              // todo admin check
              // todo action
              { path: 'new', Component: () => <div>New Blog Post</div> },
              // a form to edit a post.
              // a combo box to add/select tags
              // shared components with new post
              // todo load, auth check
              // todo action
              // todo auth check
              { path: 'edit/:id', Component: () => <div>Edit Blog Post</div> },
            ],
          },
        ],
      },
      // /user
      {
        path: 'user',
        children: [
          // user profile
          // a form to edit the info, a form to change/set the password
          // buttons to logout, delete the account
          // buttons to link/unlink the social accounts
          // todo load, auth check
          { index: true, Component: () => <div>Users</div> },
          // a form to login a new user, a form to register a new user
          // a form to link the social accounts
          { path: 'login', Component: () => <div>New User</div> },
          // a form to input the invite code
          // todo load, auth check
          { path: 'join-admin', Component: () => <div>Join Admin</div> },
        ],
      },
      // /about
      // Static page, a from to contact the admin (Email)
      {
        path: 'about',
        children: [{ index: true, Component: AboutPage }],
      },
      // /terms
      // Static page for terms and conditions
      {
        path: 'terms',
        children: [{ index: true, Component: TermsPage }],
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

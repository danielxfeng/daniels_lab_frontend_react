import { createBrowserRouter, redirect } from 'react-router-dom';
import { lazy } from 'react';
import { adminGuard, authGuard } from '@/lib/authGuard';
import AppLayout from '@/components/AppLayout';
import Loading from '@/components/Loading';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorBoundary from '@/pages/ErrorBoundary';
import postsLoader from '@/pages/Posts/postsLoader';
import PostsPage from '@/pages/Posts/PostsPage';
import PostPage from '@/pages/Post/PostPage';
import postPageLoader from '@/pages/Post/postPageLoader';
import LoginPage from '@/pages/LoginPage';
import UserProfilePage from '@/pages/UserProfilePage';
import PostCreatePage from '@/pages/PostUpsert/PostCreatePage';
import PostUpdatePage from '@/pages/PostUpsert/PostUpdatePage';

// The router of the app.
const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    HydrateFallback: Loading,
    children: [
      // /
      // redirect to /blog/posts
      { index: true, loader: () => redirect('/blog/posts') },
      // /blog
      {
        path: 'blog',
        children: [
          // redirect to /blog/posts
          { index: true, loader: () => redirect('/blog/posts') },
          {
            path: 'posts',
            children: [
              // Posts list, with a filter form.
              { index: true, Component: PostsPage, loader: postsLoader },
              // posts list for search results
              // side bar with filters, a list of hot tags
              // todo loader
              { path: 'search', Component: () => <div>Blog Search</div> },
              // post detail, comments list, like status
              { path: ':slug', Component: PostPage, loader: postPageLoader },
              // a form to add a post, admin only
              { path: 'new', Component: PostCreatePage, loader: adminGuard },
              // a form to edit a post, author only
              { path: 'edit/:id', Component: PostUpdatePage, loader: postPageLoader },
            ],
          },
        ],
      },
      // /user
      {
        path: 'user',
        children: [
          // user profile, use auth guard to protect it
          { index: true, Component: UserProfilePage, loader: authGuard },
          // a form to login a new user, a form to register a new user
          // a form to link the social accounts
          { path: 'login', Component: LoginPage },
          // a form to input the invite code
          // todo load, auth check
          { path: 'join-admin', Component: () => <div>Join Admin</div> },
        ],
      },
      // /about, Static page, a form to contact the admin (Email), lazy load it.
      {
        path: 'about',
        children: [{ index: true, Component: lazy(() => import('@/pages/AboutPage')) }],
      },
      // /terms
      // Static page for terms and conditions, lazy load it.
      {
        path: 'terms',
        children: [{ index: true, Component: lazy(() => import('@/pages/TermsPage')) }],
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

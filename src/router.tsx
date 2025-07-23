import { lazy } from 'react';
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  redirect,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';

import AppLayout from '@/components/layout/AppLayout';
import Loading from '@/components/shared/Loading';
import { adminGuard, authGuard } from '@/lib/authGuard';
import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import ErrorBoundary from '@/pages/ErrorBoundary';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PostPage from '@/pages/Post/PostPage';
import postPageLoader from '@/pages/Post/postPageLoader';
import postsLoader from '@/pages/Posts/postsLoader';
import PostsPage from '@/pages/Posts/PostsPage';
import PostsSearchPage from '@/pages/Posts/PostsSearchPage';
import ProjectsPage from '@/pages/ProjectsPage';
import UserProfilePage from '@/pages/UserProfilePage';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

// Call this AFTER Sentry.init()
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV7(createBrowserRouter);

// The router of the app.
const router = sentryCreateBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    HydrateFallback: Loading,
    children: [
      // Website
      // / Homepage
      { index: true, Component: HomePage },
      // /user
      {
        path: 'user',
        children: [
          // user profile, use auth guard to protect it
          { index: true, Component: UserProfilePage, loader: authGuard },
          // a form to login a new user, a form to register a new user
          // a form to link the social accounts
          { path: 'login', Component: LoginPage },
          // a form for user to join the admin team
          {
            path: 'join-admin',
            Component: lazy(() => import('@/pages/JoinAdminPage')),
            loader: authGuard,
          },
          // a form for admin to manage users
          { path: 'admin', Component: lazy(() => import('@/pages/AdminPage')), loader: adminGuard },
        ],
      },
      // /auth, callback from "login with social accounts"
      {
        path: 'auth',
        children: [{ index: true, Component: AuthPage }],
      },
      // /terms
      // Static page for terms and conditions, lazy load it.
      {
        path: 'terms',
        children: [{ index: true, Component: lazy(() => import('@/pages/TermsPage')) }],
      },

      // Projects
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
              { path: 'search', Component: PostsSearchPage, loader: postsLoader },
              // post detail, comments list, like status
              { path: ':slug', Component: PostPage, loader: postPageLoader },
              // a form to add a post, admin only
              {
                path: 'new',
                Component: lazy(() => import('@/pages/PostUpsert/PostCreatePage')),
                loader: adminGuard,
              },
              // a form to edit a post, author only
              {
                path: 'edit/:slug',
                Component: lazy(() => import('@/pages/PostUpsert/PostUpdatePage')),
                loader: postPageLoader,
              },
            ],
          },
        ],
      },
      // /gravity-particles
      {
        path: 'gravity-particles',
        children: [{ index: true, Component: lazy(() => import('@/pages/GravityParticlesPage')) }],
      },

      // Landing pages
      // /projects, a landing page
      {
        path: 'projects',
        children: [{ index: true, Component: ProjectsPage }],
      },
      // /about, a landing page
      {
        path: 'about',
        children: [{ index: true, Component: AboutPage }],
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

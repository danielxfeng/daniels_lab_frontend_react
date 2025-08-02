import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    file: 'router/HomeRouter.tsx',
    children: [
      { index: true, file: 'pages/HomePage.tsx' },
      {
        path: 'user',
        file: 'router/UserRouter.tsx',
        children: [
          { index: true, file: 'pages/UserProfilePage.tsx' },
          { path: 'login', file: 'pages/LoginPage.tsx' },
          { path: 'join-admin', file: 'pages/JoinAdminPage.tsx' },
          { path: 'admin', file: 'pages/AdminPage.tsx' },
        ],
      },
      { path: 'auth', file: 'pages/AuthPage.tsx' },
      { path: 'terms', file: 'pages/TermsPage.tsx' },
      {
        path: 'blog',
        file: 'router/BlogRouter.tsx',
        children: [
          { index: true, file: 'router/BlogRedirect.tsx' },
          {
            path: 'posts',
            file: 'router/PostsRouter.tsx',
            children: [
              { index: true, file: 'pages/Posts/PostsPage.tsx' },
              { path: 'search', file: 'pages/Posts/PostsSearchPage.tsx' },
              { path: ':slug', file: 'pages/PostPage.tsx' },
              { path: 'new', file: 'pages/PostUpsert/PostCreatePage.tsx' },
              { path: 'edit/:slug', file: 'pages/PostUpsert/PostUpdatePage.tsx' },
            ],
          },
        ],
      },

      { path: 'projects', file: 'pages/ProjectsPage.tsx' },
      { path: 'about', file: 'pages/AboutPage.tsx' },
    ],
  },
  { path: '*', file: 'pages/NotFound.tsx' },
] satisfies RouteConfig;

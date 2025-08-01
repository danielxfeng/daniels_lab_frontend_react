import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    file: 'components/layout/AppLayout.tsx',
    children: [
      { index: true, file: 'pages/HomePage.tsx' },
      {
        path: 'user',
        file: 'pages/UserProfilePage.tsx',
        children: [
          { path: 'login', file: 'pages/LoginPage.tsx' },
          { path: 'join-admin', file: 'pages/JoinAdminPage.tsx' },
          { path: 'admin', file: 'pages/AdminPage.tsx' },
        ],
      },
      { path: 'auth', file: 'pages/AuthPage.tsx' },
      { path: 'terms', file: 'pages/TermsPage.tsx' },
      {
        path: 'blog',
        file: 'pages/Posts/PostsDir.tsx',
        children: [
          {
            path: 'posts',
            file: 'pages/Posts/PostsPage.tsx',
            children: [
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
] satisfies RouteConfig;

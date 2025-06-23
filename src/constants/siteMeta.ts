const env = import.meta.env;

/**
 * Defines the site metadata for the application.
 */
const siteMeta = {
  paginationLimit: 10, // Number of posts per page
  siteName: env.VITE_SITE_NAME || "Daniel's Lab",
  siteDescription: env.VITE_SITE_DESCRIPTION || 'A personal blog and portfolio',
  me: env.VITE_SITE_ME || 'Daniel',
  myLocation: env.VITE_MY_LOCATION || 'Helsinki',
  myProfession: env.VITE_MY_PROFESSION || 'Software Engineer',
  myAvatar: env.VITE_MY_AVATAR || 'https://api.dicebear.com/7.x/lorelei/svg?seed=Daniel',
  myGithub: env.VITE_MY_GITHUB || 'https://www.github.com',
  myLinkedIn: env.VITE_MY_LINKEDIN || 'https://www.linkedin.com',
  myEmail: env.VITE_MY_EMAIL || 'mailto: hi@email.com',
  siteUrl: 'https://danielslab.dev',
  apiUrl: env.VITE_API_URL || 'http://localhost:3000/api',
};

export default siteMeta;

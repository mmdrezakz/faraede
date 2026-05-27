// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/register',
        '/user-dashboard',
        '/admin-dashboard',
        '/user-dashboard/*',
        '/admin-dashboard/*',
        '/api/*',
      ],
    },
    sitemap: 'https://faraede.vercel.app/sitemap.xml',
  }
}
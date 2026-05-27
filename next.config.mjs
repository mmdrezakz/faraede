/** @type {import('next').NextConfig} */
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      
    ],
  },
    experimental: {
    serverActions: {
      bodySizeLimit: '2md', // maximum `4.5MB/4MB` if you are using Vercel
    },
  },
};

export default nextConfig;



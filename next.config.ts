/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Expose only the variables we need
  env: {
    BASE_URI: process.env.NEXT_PUBLIC_BASE_URI,
  },

  // Configure Next.js Image domains or remote patterns
  images: {
    domains: [
      // extract hostname from your BASE_URI
      'schoolee-production.up.railway.app',
    ],
    // Or, if you need more flexibility:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'schoolee-production.up.railway.app',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

module.exports = nextConfig;

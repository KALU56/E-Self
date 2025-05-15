/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**', // Allows any path from this hostname
      },
      // Add other remote patterns here if needed
    ],
    // If you were using the older 'domains' config, you would add it like this:
    // domains: ['source.unsplash.com'], // Older approach, remotePatterns is preferred
  },
  // ... other configurations you might have (like experimental, webpack, etc.)
};

module.exports = nextConfig;
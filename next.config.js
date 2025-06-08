/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example_arduno.com'
      },
      {
        protocol: 'https',
        hostname: 'rees52.com'
      },
      {
        protocol: 'https',
        hostname: 'example.com'
      },
      {
        protocol: 'https',
        hostname: 'voltvillage-api.onrender.com'
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://voltvillage-api.onrender.com/api/v1/:path*',
      },
    ];
  },
};
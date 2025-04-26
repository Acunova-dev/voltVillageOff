/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['example_arduno.com', 'rees52.com'],
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
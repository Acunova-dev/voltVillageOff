/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://voltvillage-api.onrender.com/api/v1/:path*',
      },
    ];
  },
};
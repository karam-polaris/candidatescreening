/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@candidate-screening/domain', '@candidate-screening/ui'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;

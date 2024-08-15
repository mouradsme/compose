/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'd1tm299y9m1b69.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'siinedz.s3.eu-north-1.amazonaws.com',
      }
    ],
  },
};

module.exports = nextConfig;

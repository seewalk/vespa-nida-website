/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'vespanida.lt', 
      'en.vespanida.lt', 
      'de.vespanida.lt', 
      'pl.vespanida.lt'
    ],  // Add any domains you're loading images from
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Accept-Language',
            value: 'lt,en,de,pl'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      // Handle subdomain routing for different languages
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'en.vespanida.lt'
          }
        ],
        destination: '/:path*'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host', 
            value: 'de.vespanida.lt'
          }
        ],
        destination: '/:path*'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'pl.vespanida.lt'
          }
        ],
        destination: '/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
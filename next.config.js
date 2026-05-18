/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/radio',
        destination: 'https://patmos.cdnstream.com/proxy/artfmin1/?mp=/stream',
      },
    ]
  },
}

module.exports = nextConfig

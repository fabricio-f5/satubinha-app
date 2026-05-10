/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/weather',
          destination: 'http://weather:5000/api/weather'
        },
        {
          source: '/api/:path*',
          destination: 'http://api:4000/api/:path*'
        }
      ]
    }
  }
}

module.exports = nextConfig

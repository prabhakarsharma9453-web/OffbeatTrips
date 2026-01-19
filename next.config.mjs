/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js 16: serverComponentsExternalPackages moved to top-level
  // Only include packages that are actually used in API routes (not middleware)
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  // Add empty turbopack config to silence the error when using webpack
  turbopack: {},
  // Webpack config for non-Turbopack builds
  webpack: (config, { isServer, isMiddleware }) => {
    if (isServer && !isMiddleware) {
      // Only mark as external for server-side API routes, not middleware
      config.externals = config.externals || []
      config.externals.push({
        'mongoose': 'commonjs mongoose',
        'bcryptjs': 'commonjs bcryptjs',
      })
    }
    return config
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side external packages for transformers.js
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers', 'sharp', 'onnxruntime-node'],
  },
  webpack: (config, { isServer }) => {
    // Handle transformers.js in webpack
    if (isServer) {
      config.externals = [...(config.externals || []), '@xenova/transformers']
    }
    
    // Ignore node-specific modules in client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    
    return config
  },
}

module.exports = nextConfig

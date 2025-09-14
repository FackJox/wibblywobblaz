import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Code splitting and tree shaking optimizations
  webpack: (config, { dev, isServer }) => {
    // Tree shaking optimization
    config.optimization = {
      ...config.optimization,
      // Only enable usedExports in production to avoid caching conflicts
      ...(dev ? {} : { usedExports: true }),
      sideEffects: false,
      providedExports: true,
      // Split chunks for better caching
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          // Separate animation-related code
          animations: {
            test: /[\\/](hooks|components)[\\/].*animation.*[\\/]/,
            name: 'animations',
            chunks: 'async',
            priority: 10,
          },
          // Separate UI components
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'async',
            priority: 5,
          },
        },
      },
    }

    // Reduce bundle size by excluding unnecessary polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
  // Performance monitoring and experimental features
  experimental: {
    // Optimize for smaller bundles
    optimizeCss: true,
    // Reduce JavaScript bundle size
    swcTraceProfiling: process.env.NODE_ENV === 'development',
    // Enable webpack bundle analysis
    bundlePagesRouterDependencies: true,
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
}

export default withBundleAnalyzer(nextConfig)

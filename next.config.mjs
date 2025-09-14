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
  experimental: {
    // Enable webpack bundle analysis
    bundlePagesRouterDependencies: true,
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
}

export default withBundleAnalyzer(nextConfig)

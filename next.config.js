/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import withBundleAnalyzer from '@next/bundle-analyzer';

// Enable the bundle analyzer if ANALYZE environment variable is set to 'true'
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Export the configuration with the bundle analyzer applied
export default bundleAnalyzer(nextConfig);
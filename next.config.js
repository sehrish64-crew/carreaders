/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tensorflow/tfjs': '@tensorflow/tfjs/dist/tf.min.js',
    };
    return config;
  },
};
export default nextConfig;

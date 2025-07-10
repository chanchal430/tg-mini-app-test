// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// };

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Disable static optimization for SPA behavior
  output: "export",
  // Optional: Add basePath if deploying to subdirectory
  // basePath: '/your-subdirectory',
  images: {
    unoptimized: true, // Required for static export
  },
};

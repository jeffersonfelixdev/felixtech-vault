/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api-docs",
        destination: "/api-docs/index.html",
      },
    ];
  },
};

module.exports = nextConfig;

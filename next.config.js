/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/auth/yahoo/callback",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
        ],
      },
    ];
  },
};

module.exports = nextConfig;

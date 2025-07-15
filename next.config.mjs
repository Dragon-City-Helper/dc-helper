/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/rate",
        destination: "/rate/heroic",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dci-static-s1.socialpointgames.com",
        port: "",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/notifications",
      "@mantine/charts",
    ],
  },
};

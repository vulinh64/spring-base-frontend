/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const authUrl = process.env.AUTH_URL || "http://localhost:8080";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8088";
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authUrl}/auth/:path*`,
      },
      {
        source: "/api/accounts/:path*",
        destination: `${authUrl}/accounts/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

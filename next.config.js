/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Google Sheets API calls server-side
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;

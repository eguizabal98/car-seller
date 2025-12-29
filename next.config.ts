import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-us.mchost.guru',
        pathname: '/api/ide/v1/text_to_image',
      },
      {
        protocol: 'https',
        hostname: 'cnayqnkvvqohmbuiwtig.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

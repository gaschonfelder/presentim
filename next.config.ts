// import type { NextConfig } from "next";
/*
const nextConfig: NextConfig = {
  /* config options here 
};

export default nextConfig;
*/
// next.config.ts
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
}
export default nextConfig
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.56.1"],
  // redirects: () => {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/play",
  //       permanent: false,
  //     },
  //   ];
  // },
  /* config options here */
};

export default nextConfig;

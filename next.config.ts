import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  crossOrigin: "anonymous",
  allowedDevOrigins: ["192.168.56.1", "192.168.1.3"],
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

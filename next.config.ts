import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public", // Diretório de destino para os arquivos do service worker
  register: true, // Registrar o service worker automaticamente
  skipWaiting: true, // Forçar a ativação do novo service worker
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.vercel-storage.com", // Permite qualquer subdomínio do vercel-storage.com
        port: "",
        pathname: "/**", // Permite qualquer caminho de arquivo
      },
    ],
  },
};

export default withPWA(nextConfig);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Permitir el acceso desde la IP de la red para evitar bloqueos de hidratación
  allowedDevOrigins: ["10.2.0.2", "10.2.0.2:3000", "192.168.5.87", "localhost:3000", "192.168.5.87:3000", "192.168.5.150", "192.168.5.150:3000", "172.20.10.7", "172.20.10.7:3000"],
  experimental: {
    outputFileTracingRoot: __dirname,
  },
}

export default nextConfig

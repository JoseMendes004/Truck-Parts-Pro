/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Permitir el acceso desde la IP de la red para evitar bloqueos de hidratación
  experimental: {
    allowedDevOrigins: ["192.168.5.87", "localhost:3000", "192.168.5.87:3000"]
  }
}

export default nextConfig

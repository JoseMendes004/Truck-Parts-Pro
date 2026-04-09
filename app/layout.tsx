import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { FontApplier } from '@/components/font-applier'
import { CartProvider } from '@/contexts/cart-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: 'TruckParts Pro',
  description: 'Tu proveedor de confianza en autopartes para camiones de carga. Más de 15 años de experiencia, 10,000+ productos en stock y entregas en 24 horas.',
  keywords: ['autopartes', 'camiones', 'repuestos', 'carga', 'transporte', 'refacciones'],
  icons: {
    icon: '/logo_gear.png?v=2',
    apple: '/logo_gear.png?v=2',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <FontApplier />
              {children}
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

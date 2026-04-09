"use client"

import Link from "next/link"
import { Truck } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/logo_gear.png?v=2" alt="TruckParts Pro" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Tu proveedor de confianza en autopartes para camiones de carga. 
              Más de 15 años de experiencia nos respaldan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-foreground/70 hover:text-accent transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/dashboard#productos" className="text-foreground/70 hover:text-accent transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/dashboard#servicios" className="text-foreground/70 hover:text-accent transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/dashboard#contacto" className="text-foreground/70 hover:text-accent transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
                  Motores y Componentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
                  Sistema de Frenos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
                  Transmisión
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
                  Sistema Eléctrico
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
                  Refrigeración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>+52 (555) 123-4567</li>
              <li>ventas@truckpartspro.com</li>
              <li>Av. Industrial 1234</li>
              <li>Col. Centro, CDMX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">
            © 2026 TruckParts Pro. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-foreground/60 hover:text-accent transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-accent transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

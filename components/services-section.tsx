"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Truck, 
  Wrench, 
  Clock, 
  Shield, 
  Headphones, 
  MapPin,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Truck,
    title: "Envío a Todo el País",
    description: "Entregamos tus repuestos en cualquier parte del país con seguimiento en tiempo real.",
    features: ["Envío express 24h", "Seguimiento online", "Seguro incluido"],
  },
  {
    icon: Wrench,
    title: "Asesoría Técnica",
    description: "Nuestro equipo de expertos te ayuda a encontrar la pieza exacta para tu camión.",
    features: ["Técnicos certificados", "Soporte por WhatsApp", "Manuales incluidos"],
  },
  {
    icon: Shield,
    title: "Garantía Extendida",
    description: "Todos nuestros productos cuentan con garantía de fábrica y respaldo total.",
    features: ["Garantía de 12 meses", "Cambio sin costo", "Devolución fácil"],
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Atención continua para emergencias y pedidos urgentes en cualquier momento.",
    features: ["Línea de emergencia", "Pedidos online", "Atención personalizada"],
  },
]

const stats = [
  { value: "50,000+", label: "Clientes Satisfechos" },
  { value: "15+", label: "Años de Experiencia" },
  { value: "10,000+", label: "Productos en Stock" },
  { value: "98%", label: "Entregas a Tiempo" },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Más que una tienda de autopartes, somos tu aliado estratégico para mantener 
            tu flota de camiones en óptimas condiciones.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group bg-secondary/20 border-secondary/30 card-glow h-full backdrop-blur-sm transition-all hover:bg-secondary/40 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-secondary/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-secondary/30 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-7 h-7 text-accent drop-shadow-md" />
                </div>
                <CardTitle className="text-lg text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Bar - Glass style */}
        <div className="bg-secondary/10 backdrop-blur-md border border-secondary/30 text-foreground rounded-2xl p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70 uppercase tracking-widest font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div id="contacto" className="mt-16 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              ¿Necesitas Ayuda para Encontrar tu Repuesto?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro equipo de especialistas está listo para ayudarte a encontrar 
              la pieza exacta que necesitas. Contáctanos ahora y recibe asesoría 
              personalizada sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-foreground glow-accent-btn">
                <Headphones className="mr-2 h-5 w-5" />
                Llamar Ahora
              </Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                <MapPin className="mr-2 h-5 w-5" />
                Ver Ubicación
              </Button>
            </div>
          </div>
          
          <Card className="bg-secondary/10 border-secondary/30 backdrop-blur-md shadow-xl">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-foreground">Información de Contacto</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 bg-secondary/20 border border-secondary/30 rounded-lg flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Teléfono</p>
                    <p>+52 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 bg-secondary/20 border border-secondary/30 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Dirección</p>
                    <p>Av. Industrial 1234, Col. Centro</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 bg-secondary/20 border border-secondary/30 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Horario</p>
                    <p>Lun - Sáb: 8:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-foreground mt-4 glow-accent-btn">
                Enviar Mensaje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

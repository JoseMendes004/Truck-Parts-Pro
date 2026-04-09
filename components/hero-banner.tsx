"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Award } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Video & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/camion.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Overlay darkening inspired by Login, using theme background color for consistency */}
      <div className="absolute inset-0 z-0 bg-background/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background/10 to-background/40" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* --- CONTENT (Left Panel) - Transparent style matching login --- */}
          <div className="relative space-y-8 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-foreground text-xs tracking-[0.2em] font-bold uppercase drop-shadow-md backdrop-blur-md w-fit">
              <Shield className="w-4 h-4" />
              Autopartes Certificadas
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground tracking-tight leading-[0.9] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              Repuestos<br />
              de Calidad<br />
              para Tu Camión
            </h1>
            
            <p className="text-foreground/90 font-medium text-lg lg:text-xl max-w-lg leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Más de 15 años distribuyendo autopartes para camiones de carga. 
              Contamos con el mayor inventario de la región y entregas en tiempo récord.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                 className="relative w-fit sm:w-64 max-w-full bg-accent text-foreground font-bold uppercase tracking-widest py-[16px] px-8 rounded-xl outline-none
                            border-t border-t-white/30 border-x border-x-white/10 border-b border-b-black/40 
                            shadow-lg hover:brightness-110 active:scale-95
                            transition-all flex items-center justify-center gap-3 group glow-accent-btn"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-secondary/30 mt-8">
              <div>
                <div className="flex items-center gap-2 text-foreground drop-shadow-md">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">15+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-foreground/90 mt-1 uppercase tracking-widest font-semibold">Experiencia</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-foreground drop-shadow-md">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">10k+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-foreground/90 mt-1 uppercase tracking-widest font-semibold">Stock</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-foreground drop-shadow-md">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">24h</span>
                </div>
                <p className="text-[10px] sm:text-xs text-foreground/90 mt-1 uppercase tracking-widest font-semibold">Express</p>
              </div>
            </div>
          </div>
          
          {/* --- RIGHT PANEL (Glass Grid) - Matching Login style --- */}
          <div className="relative hidden lg:block">
            {/* Glass Container */}
            <div className="relative bg-transparent backdrop-blur-lg border border-secondary/30 rounded-3xl p-8 xl:p-12 shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.5),0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-center">
              
              <div className="mb-8 text-center">
                 <h2 className="text-2xl xl:text-3xl font-bold text-foreground uppercase tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                   Sistemas Clave
                 </h2>
                 <p className="text-foreground/90 text-[10px] uppercase tracking-[0.1em] mt-2 drop-shadow-sm font-medium">
                   Explora nuestras categorías principales
                 </p>
              </div>

              {/* Grid of Nested Glass Cards */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                
                {/* Card 1 */}
                <div className="bg-transparent border border-secondary/30 rounded-[1.5rem] p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-secondary/10 hover:border-secondary/40 hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-secondary/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-secondary/30 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground tracking-wider uppercase text-sm drop-shadow-md">Motores</h3>
                  <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 uppercase tracking-widest font-semibold">+500 refs</p>
                </div>
                
                {/* Card 2 */}
                <div className="bg-transparent border border-secondary/30 rounded-[1.5rem] p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-secondary/10 hover:border-secondary/40 hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-secondary/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-secondary/30 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground tracking-wider uppercase text-sm drop-shadow-md">Transmisión</h3>
                  <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 uppercase tracking-widest font-semibold">+300 refs</p>
                </div>
                
                {/* Card 3 */}
                <div className="bg-transparent border border-secondary/30 rounded-[1.5rem] p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-secondary/10 hover:border-secondary/40 hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-secondary/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-secondary/30 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground tracking-wider uppercase text-sm drop-shadow-md">Frenos</h3>
                  <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 uppercase tracking-widest font-semibold">+400 refs</p>
                </div>
                
                {/* Card 4 */}
                <div className="bg-transparent border border-secondary/30 rounded-[1.5rem] p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-secondary/10 hover:border-secondary/40 hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-secondary/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-secondary/30 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground tracking-wider uppercase text-sm drop-shadow-md">Eléctricos</h3>
                  <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 uppercase tracking-widest font-semibold">+600 refs</p>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

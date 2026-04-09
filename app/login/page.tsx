"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Lock, User, Loader2, ArrowRight, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas. Por favor intente de nuevo.")
    }
  }

  return (
    <main className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Video inspired by Bloom, using the truck video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          key="login-video-new"
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/nuevo_camion.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Overlay darkening with theme background color for consistency */}
      <div className="absolute inset-0 z-0 bg-background/30" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background/10 to-background/60 backdrop-blur-[2px]" />
      
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center max-w-7xl">
        
        {/* --- PANEL IZQUIERDO (Textos) - Totalmente Transparente --- */}
        <div className="relative p-8 lg:p-14 flex flex-col justify-center group">
           
           <p className="text-foreground/80 text-xs sm:text-sm tracking-[0.3em] font-bold uppercase mb-4 drop-shadow-md">
             Estándar Industrial
           </p>
           <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[0.9] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
             TruckParts<br />
             <span 
               className="text-transparent drop-shadow-none" 
               style={{ WebkitTextStroke: "1px var(--foreground, rgba(255,255,255,0.9))" }}
             >
               Pro
             </span>
           </h1>
           <p className="text-foreground/90 font-medium text-lg max-w-lg mt-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
             Componentes de precisión de alto rendimiento para la industria de transporte pesado. 
             Accede a tu inventario de gestión de flotas y especificaciones técnicas.
           </p>
        </div>

        {/* --- PANEL DERECHO (Login Card) - Glass Grid style --- */}
        <div className="relative bg-transparent backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12 shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.5),0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-center">
           
           <div className="mb-10 text-center">
             <h2 className="text-3xl lg:text-4xl font-bold text-foreground uppercase tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
               Inicio de Sesión
             </h2>
             <p className="text-foreground/80 text-[10px] sm:text-xs uppercase tracking-[0.1em] mt-3 drop-shadow-sm font-medium">
               Ingresa tus credenciales para acceder al sistema
             </p>
           </div>

           <form onSubmit={handleSubmit} className="relative">
             {error && (
               <div className="mb-6 p-3 bg-red-500/30 backdrop-blur-md border border-red-400 text-foreground font-semibold text-xs rounded-xl shadow-lg text-center">
                 {error}
               </div>
             )}
             
             {/* Caja Interior de los Inputs (Nested Glass) */}
             <div className="bg-transparent border border-white/20 rounded-[2rem] p-6 lg:p-8 space-y-6 pb-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
               <div className="space-y-2 relative z-10">
                 <label htmlFor="email" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-widest pl-1 drop-shadow-md">
                   Identificación (Correo)
                 </label>
                 <div className="relative">
                   <input
                     id="email"
                     type="email"
                     placeholder="operador@camiones.fleet"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full bg-black/20 backdrop-blur-sm border border-white/30 focus:border-white focus:bg-white/10 text-foreground placeholder:text-foreground/50 px-5 py-3.5 rounded-xl outline-none text-sm transition-all shadow-inner"
                   />
                   <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                 </div>
               </div>
               
               <div className="space-y-2 relative z-10">
                 <label htmlFor="password" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-widest pl-1 drop-shadow-md">
                   Código de Acceso (Contraseña)
                 </label>
                 <div className="relative">
                   <input
                     id="password"
                     type="password"
                     placeholder="••••••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="w-full bg-black/20 backdrop-blur-sm border border-white/30 focus:border-white focus:bg-white/10 text-foreground placeholder:text-foreground/50 px-5 py-3.5 rounded-xl outline-none text-sm transition-all shadow-inner"
                   />
                   <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                 </div>
               </div>
             </div>
             
             {/* Botón 3D a lo ancho completo, colocado debajo con separación */}
             <div className="w-full mt-8">
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full relative bg-accent text-foreground font-bold uppercase tracking-widest py-[18px] rounded-xl outline-none
                            border-t border-t-white/50 border-x border-x-white/20 border-b border-b-black/80 
                            shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.6)]
                            hover:brightness-110
                            active:translate-y-[2px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.5)]
                            transition-all flex items-center justify-center gap-3 group glow-accent-btn"
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Autenticando...
                   </>
                 ) : (
                   <>
                     Iniciar Sesión
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
             </div>
           </form>

           {/* Bloque de Credenciales */}
           <div className="mt-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.3)]">
             <p className="text-[10px] font-bold text-foreground/90 uppercase tracking-widest mb-3 text-center drop-shadow-md">
               Credenciales de Acceso
             </p>
             <div className="flex flex-col md:flex-row justify-between gap-4 text-[10px] px-2">
               <div className="flex flex-col">
                 <span className="text-foreground/70 mb-1 font-semibold">USUARIO</span>
                 <span className="text-foreground font-semibold flex items-center gap-1">usuario@truckparts.com</span>
                 <span className="text-foreground/80">usuario123</span>
               </div>
               <div className="hidden md:block w-px bg-white/20" />
               <div className="flex flex-col text-left md:text-right">
                 <span className="text-foreground/70 mb-1 font-semibold">ADMINISTRADOR</span>
                 <span className="text-foreground font-semibold flex items-center gap-1 md:justify-end">admin@truckparts.com</span>
                 <span className="text-foreground/80">admin123</span>
               </div>
             </div>
           </div>
           
        </div>
      </div>
      
      {/* Footer text */}
      <div className="absolute bottom-4 right-8 text-[8px] sm:text-[10px] text-foreground/60 uppercase tracking-[0.2em] font-bold drop-shadow-sm hidden md:block">
        SISTEMA SEGURO V3.4.1
      </div>
    </main>
  )
}

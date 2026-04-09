"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { AdminInventory } from "@/components/admin-inventory"
import { AdminFactura } from "@/components/admin-factura"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  Loader2,
  Eye,
  Palette,
  Type,
  ArrowLeft,
  Package,
  Settings,
  Sun,
  Moon,
  FileText,
} from "lucide-react"
import Link from "next/link"

import { ColoresSection } from "./_sections/ColoresSection"
import { TypografiaSection } from "./_sections/TypografiaSection"
import { PreviewPanel } from "./_sections/PreviewPanel"

type ActiveSection = "colors" | "typography" | "inventory" | "invoice"

interface PreviewTheme {
  name: string
  colors: {
    primary: string
    accent: string
    background: string
    foreground: string
  }
  font: string
}

const DEFAULT_PREVIEW_THEME: PreviewTheme = {
  name: "",
  colors: { primary: "#dc4a1a", accent: "#dc4a1a", background: "#fafafa", foreground: "#1a1a1a" },
  font: "Geist",
}

const SECTION_LABELS: Record<ActiveSection, { icon: React.ElementType; label: string }> = {
  colors:     { icon: Palette,   label: "Gestión de Colores" },
  typography: { icon: Type,      label: "Gestión de Tipografía" },
  inventory:  { icon: Package,   label: "Gestión de Inventario" },
  invoice:    { icon: FileText,  label: "Gestión de Factura" },
}

const NAV_ITEMS: { key: ActiveSection; icon: React.ElementType; label: string }[] = [
  { key: "colors",     icon: Palette,  label: "Colores" },
  { key: "typography", icon: Type,     label: "Tipografía" },
  { key: "inventory",  icon: Package,  label: "Inventario" },
  { key: "invoice",    icon: FileText, label: "Factura" },
]

const THEME_OPTIONS = [
  { value: "light"       as const, label: "Modo Claro",    icon: Sun },
  { value: "dark"        as const, label: "Modo Oscuro",   icon: Moon },
  { value: "colorblind"  as const, label: "Modo Daltónico", icon: Eye },
]

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const { theme, setTheme, globalTypography } = useTheme()
  const router = useRouter()

  const [activeSection, setActiveSection] = useState<ActiveSection>("colors")
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(DEFAULT_PREVIEW_THEME)
  const [previewTypography, setPreviewTypography] = useState(globalTypography)

  const handlePreviewTypographyChange = useCallback((t: any) => {
    setPreviewTypography(t)
  }, [])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) return null

  const hasPreview = activeSection !== "inventory" && activeSection !== "invoice"
  const { icon: SectionIcon, label: sectionLabel } = SECTION_LABELS[activeSection]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">

        {/* ── Sidebar ── */}
        <Sidebar className="border-r border-sidebar-border bg-sidebar">
          <SidebarHeader className="p-4 border-b border-sidebar-border/50">
            <Link href="/dashboard" className="flex items-center justify-center">
              <img src="/logo_gear.png?v=2" alt="TruckParts Pro" className="h-10 w-auto object-contain" />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-2 pt-4">
              <SidebarGroupLabel className="text-accent px-4 py-4 text-xs font-black uppercase tracking-[0.2em] opacity-80">
                Gestión
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        isActive={activeSection === key}
                        onClick={() => setActiveSection(key)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                          activeSection === key
                            ? "bg-accent text-accent-foreground font-bold shadow-sm"
                            : "text-foreground/70 hover:bg-accent/15 hover:text-accent"
                        )}
                      >
                        <Icon className={cn("h-5 w-5 shrink-0", activeSection === key ? "text-accent-foreground" : "text-accent")} />
                        <span className="text-[14px]">{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* ── Main ── */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">

          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-xl font-bold flex items-center gap-2 text-accent">
                <SectionIcon className="h-5 w-5" />
                {sectionLabel}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground relative hover:bg-accent/10 transition-all duration-300" title="Ajustes de Apariencia">
                    <Settings className="h-5 w-5 transition-transform duration-300 hover:rotate-90 text-accent" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/80 backdrop-blur-2xl border border-border shadow-2xl p-2 rounded-2xl">
                  <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    Apariencia
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {THEME_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex items-center gap-2 cursor-pointer rounded-xl transition-all duration-300 px-3 py-2.5 mb-1.5 last:mb-0 ${theme !== option.value ? "hover:bg-muted text-foreground" : ""}`}
                      style={theme === option.value ? { backgroundColor: "var(--accent)", color: "var(--accent-foreground)" } : undefined}
                    >
                      <option.icon className="h-4 w-4" style={{ color: theme === option.value ? "var(--accent-foreground)" : "var(--muted-foreground)" }} />
                      <span style={{ fontWeight: theme === option.value ? 500 : 400 }}>{option.label}</span>
                      {theme === option.value && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-border/50 hover:bg-accent/10 hover:text-accent transition-all">
                  <ArrowLeft className="h-4 w-4" /> Volver al Sitio
                </Button>
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className={`grid gap-8 max-w-7xl mx-auto ${hasPreview ? "lg:grid-cols-2" : "grid-cols-1"}`}>

              {/* Sección activa */}
              <div className="space-y-6">
                {activeSection === "colors" && (
                  <ColoresSection onPreviewChange={setPreviewTheme} />
                )}
                {activeSection === "typography" && (
                  <TypografiaSection onPreviewTypographyChange={handlePreviewTypographyChange} />
                )}
                {activeSection === "inventory" && <AdminInventory />}
                {activeSection === "invoice" && <AdminFactura />}
              </div>

              {/* Panel de previsualización */}
              {hasPreview && (
                <PreviewPanel previewTheme={previewTheme} previewTypography={previewTypography} />
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

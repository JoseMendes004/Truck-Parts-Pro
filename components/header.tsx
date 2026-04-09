"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { useCart } from "@/contexts/cart-context"
import { CheckoutDialog } from "@/components/checkout-dialog"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Truck,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  Eye,
  Menu,
  X,
  ShoppingCart,
  Phone,
  Wrench,
  Trash2,
  Plus,
  Minus,
} from "lucide-react"

export function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const { items, removeItem, updateQty, total, count } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const themeOptions = [
    { value: "light" as const, label: "Modo Claro", icon: Sun },
    { value: "dark" as const, label: "Modo Oscuro", icon: Moon },
    { value: "colorblind" as const, label: "Modo Daltónico", icon: Eye },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logo_gear.png?v=2" alt="TruckParts Pro" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-foreground">Truck Parts Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground hover:opacity-80 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/dashboard#productos"
              className="text-sm font-medium text-foreground hover:opacity-80 transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/dashboard#servicios"
              className="text-sm font-medium text-foreground hover:opacity-80 transition-colors"
            >
              Servicios
            </Link>
            <Link
              href="/dashboard#contacto"
              className="text-sm font-medium text-foreground hover:opacity-80 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">

            {/* 🛒 Cart Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground relative" title="Carrito">
                  <ShoppingCart className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-border">
                <SheetHeader className="border-b border-border pb-4">
                  <SheetTitle className="flex items-center gap-2 text-foreground">
                    <ShoppingCart className="h-5 w-5" style={{ color: "var(--accent)" }} />
                    Carrito
                    {count > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
                        {count}
                      </span>
                    )}
                  </SheetTitle>
                </SheetHeader>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
                      <ShoppingCart className="h-12 w-12 opacity-20" />
                      <p className="text-sm">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center rounded-xl border border-border p-3">
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover shrink-0 bg-muted" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <p className="text-sm font-bold mt-1" style={{ color: "var(--accent)" }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, item.qty + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-semibold text-foreground w-5 text-center">{item.qty}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, item.qty - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer total */}
                {items.length > 0 && (
                  <div className="border-t border-border pt-4 pb-4 px-1 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
                    </div>
                    <Button className="w-full font-semibold h-11 mb-2" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }} onClick={() => setCheckoutOpen(true)}>
                      Proceder al Pago
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />

            {/* ⚙️ Settings Gear — unified settings menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground relative"
                  title="Ajustes"
                >
                  <Settings className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
                  <span className="sr-only">Ajustes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/80 backdrop-blur-2xl border border-border shadow-2xl p-2 rounded-2xl">
                {/* Theme section */}
                <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  <Moon className="h-4 w-4" />
                  Apariencia
                </DropdownMenuLabel>

                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex items-center gap-2 cursor-pointer rounded-xl transition-all duration-300 px-3 py-2.5 mb-1.5 last:mb-0 ${
                      theme !== option.value ? "hover:bg-muted text-foreground" : ""
                    }`}
                    style={
                      theme === option.value 
                        ? { backgroundColor: "var(--accent)", color: "var(--accent-foreground)" } 
                        : undefined
                    }
                  >
                    <option.icon 
                      className="h-4 w-4" 
                      style={{ color: theme === option.value ? "var(--accent-foreground)" : "var(--muted-foreground)" }} 
                    />
                    <span style={{ fontWeight: theme === option.value ? 500 : 400 }}>{option.label}</span>
                    {theme === option.value && (
                      <span className="ml-auto">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}

                {/* Admin section — only visible to admins */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-border my-2" />
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-2 cursor-pointer rounded-xl transition-all duration-300 px-3 py-2.5 hover:bg-muted text-foreground"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Panel de Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menú de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/80 backdrop-blur-2xl border border-border shadow-2xl p-2 rounded-2xl text-foreground">
                <DropdownMenuLabel className="font-normal px-2 py-1.5 text-muted-foreground">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>
                      {isAdmin ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border my-2" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer rounded-xl transition-all duration-300 px-3 py-2.5 hover:bg-muted text-foreground"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Truck className="h-4 w-4" />
                Inicio
              </Link>
              <Link
                href="/dashboard#productos"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Productos
              </Link>
              <Link
                href="/dashboard#servicios"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wrench className="h-4 w-4" />
                Servicios
              </Link>
              <Link
                href="/dashboard#contacto"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-4 w-4" />
                Contacto
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

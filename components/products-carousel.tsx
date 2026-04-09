"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

export const staticProducts = [
  {
    id: 1,
    name: "Filtro de Aire K&N",
    category: "Filtros",
    price: 89.99,
    originalPrice: 120.00,
    rating: 4.8,
    reviews: 124,
    image: "/products/filter.jpg",
    badge: "Más Vendido",
  },
  {
    id: 2,
    name: "Pastillas de Freno Brembo",
    category: "Frenos",
    price: 156.50,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800",
    badge: "Premium",
  },
  {
    id: 3,
    name: "Amortiguador Monroe",
    category: "Suspensión",
    price: 234.00,
    originalPrice: 280.00,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1635437536607-b85ad9cd30bc?q=80&w=800",
    badge: "En Stock",
  },
  {
    id: 4,
    name: "Kit de Embrague Sachs",
    category: "Transmisión",
    price: 445.00,
    originalPrice: null,
    rating: 4.6,
    reviews: 78,
    image: "/products/clutch.jpg",
    badge: null,
  },
  {
    id: 5,
    name: "Alternador Bosch",
    category: "Eléctrico",
    price: 312.00,
    originalPrice: 350.00,
    rating: 4.8,
    reviews: 102,
    image: "https://images.unsplash.com/photo-1601053151838-890cae2540b0?q=80&w=800",
    badge: "Premium",
  },
  {
    id: 6,
    name: "Radiador Valeo",
    category: "Refrigeración",
    price: 278.50,
    originalPrice: null,
    rating: 4.5,
    reviews: 67,
    image: "/products/radiator.jpg",
    badge: null,
  },
  {
    id: 7,
    name: "Turbo Garrett",
    category: "Motor",
    price: 890.00,
    originalPrice: 1050.00,
    rating: 4.9,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1600712242805-5f996748fd99?q=80&w=800",
    badge: "En Stock",
  },
  {
    id: 8,
    name: "Bomba de Agua GMB",
    category: "Refrigeración",
    price: 145.00,
    originalPrice: null,
    rating: 4.4,
    reviews: 91,
    image: "/products/pump.jpg",
    badge: null,
  },
]

export function ProductsCarousel() {
  const { addItem } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [loadedProducts, setLoadedProducts] = useState(staticProducts)
  const [search, setSearch] = useState("")

  const filteredProducts = search.trim()
    ? loadedProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : loadedProducts

  useEffect(() => {
    const loadCustomProducts = () => {
      try {
        const custom = JSON.parse(localStorage.getItem("truckparts_custom_products") || "[]")
        const hidden = JSON.parse(localStorage.getItem("truckparts_hidden_static") || "[]")
        
        // Filter out static products that were hidden (deleted or replaced)
        const filteredStatic = staticProducts.filter(p => !hidden.includes(p.id))
        
        setLoadedProducts([...custom, ...filteredStatic])
      } catch (e) {
        setLoadedProducts(staticProducts)
      }
    }

    loadCustomProducts()

    // Sincronización automática de imágenes para productos estáticos en el almacenamiento local
    const syncImages = () => {
      try {
        const custom = JSON.parse(localStorage.getItem("truckparts_custom_products") || "[]")
        let changed = false
        const updated = custom.map((p: any) => {
          const staticMatch = staticProducts.find(sp => sp.id === p.id)
          // Si el ID coincide y la imagen no es una URL externa (empezando con http), la forzamos
          if (staticMatch && (p.image === "" || !p.image.startsWith('http'))) {
             p.image = staticMatch.image
             changed = true
          }
          return p
        })
        if (changed) {
          localStorage.setItem("truckparts_custom_products", JSON.stringify(updated))
          loadCustomProducts()
        }
      } catch (e) {}
    }
    syncImages()

    window.addEventListener('productsUpdated', loadCustomProducts)
    return () => window.removeEventListener('productsUpdated', loadCustomProducts)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 768) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView)

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }, [maxIndex])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [maxIndex])

  return (
    <section id="productos" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground">
              Las mejores autopartes con garantía de calidad
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentIndex(0) }}
                placeholder="Buscar producto o categoría..."
                className="pl-9 pr-8 h-9 text-sm bg-secondary/20 border-border"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Nav buttons — only shown when not searching */}
            {!search && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="border-border text-foreground hover:bg-muted disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  disabled={currentIndex === maxIndex}
                  className="border-border text-foreground hover:bg-muted disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Results count when searching */}
        {search && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length === 0
              ? "Sin resultados"
              : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""} encontrado${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* Carousel / Grid */}
        {search ? (
          filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Search className="h-12 w-12 opacity-20" />
              <p className="text-sm">No se encontraron productos para &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group bg-secondary/20 border-secondary/30 card-glow h-full backdrop-blur-sm transition-all hover:bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="relative aspect-square bg-secondary/40 rounded-lg mb-4 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="25vw" unoptimized={product.image.endsWith(".svg")} />
                      {product.badge && (
                        <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg glow-accent-btn">{product.badge}</Badge>
                      )}
                      <Button size="icon" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground hover:bg-accent/90 z-10 glow-accent-btn"
                        onClick={() => { addItem({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image }); toast.success(`${product.name} agregado al carrito`, { description: `$${product.price.toFixed(2)}`, duration: 3000 }) }}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                      <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium text-foreground">{Math.round(product.rating)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                        {product.originalPrice && <span className="text-sm text-foreground/50 line-through">${product.originalPrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <>
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerView}%` }}>
                    <Card className="group bg-secondary/20 border-secondary/30 card-glow h-full backdrop-blur-sm transition-all hover:bg-secondary/30">
                      <CardContent className="p-4">
                        <div className="relative aspect-square bg-secondary/40 rounded-lg mb-4 overflow-hidden">
                          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" unoptimized={product.image.endsWith(".svg")} />
                          {product.badge && (
                            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg glow-accent-btn">{product.badge}</Badge>
                          )}
                          <Button size="icon" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground hover:bg-accent/90 z-10 glow-accent-btn"
                            onClick={() => { addItem({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image }); toast.success(`${product.name} agregado al carrito`, { description: `$${product.price.toFixed(2)}`, duration: 3000 }) }}>
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="text-sm font-medium text-foreground">{Math.round(product.rating)}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                            {product.originalPrice && <span className="text-sm text-foreground/50 line-through">${product.originalPrice.toFixed(2)}</span>}
                          </div>
                          {(product as any).saleQuantities && (product as any).saleQuantities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {(product as any).saleQuantities.map((qty: number) => (
                                <span key={qty} className="px-2 py-0.5 rounded-full border border-accent/40 text-accent text-[9px] font-bold bg-accent/5">
                                  {qty} {qty === 1 ? "unidad" : "unds"}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="pt-3 mt-3 border-t border-border/40 flex flex-col gap-1.5 text-[11px] text-muted-foreground">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Marca</span>
                              <span className="text-foreground max-w-[120px] truncate text-right">{(product as any).customMarca || "Genérica"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Medidas</span>
                              <span className="text-foreground max-w-[120px] truncate text-right">{(product as any).customMedidas || "Estándar"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Vehículo</span>
                              <span className="text-foreground max-w-[120px] truncate text-right">{(product as any).customVehiculo || "Universal"}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

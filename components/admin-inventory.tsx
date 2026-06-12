"use client"

import { useState, useRef, useEffect } from "react"
import NextImage from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Image as ImageIcon, Save, Check, ShoppingCart, Star, Plus, X, Trash2, Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { staticProducts } from "@/components/products-carousel"

const DEFAULT_QUANTITIES = [1, 2, 4, 5, 10, 12, 15, 20, 24, 50]
const DEFAULT_SELECTED: number[] = []

function loadQuantitiesFromStorage() {
  try {
    const q = localStorage.getItem("truckparts_quantities")
    const s = localStorage.getItem("truckparts_selected_quantities")
    return {
      quantities: q ? JSON.parse(q) : DEFAULT_QUANTITIES,
      selected: s ? JSON.parse(s) : DEFAULT_SELECTED,
    }
  } catch {
    return { quantities: DEFAULT_QUANTITIES, selected: DEFAULT_SELECTED }
  }
}

function ImageCropper({ src, naturalWidth, naturalHeight, onConfirm, onCancel }: {
  src: string
  naturalWidth: number
  naturalHeight: number
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
}) {
  const CROP_D = 380

  const minZoom = CROP_D / Math.min(naturalWidth, naturalHeight)
  const maxZoom = minZoom * 5

  const [zoom, setZoom] = useState(minZoom)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const imgW = naturalWidth * zoom
  const imgH = naturalHeight * zoom
  const maxOffX = Math.max(0, (imgW - CROP_D) / 2)
  const maxOffY = Math.max(0, (imgH - CROP_D) / 2)
  const imgLeft = CROP_D / 2 + offset.x - imgW / 2
  const imgTop  = CROP_D / 2 + offset.y - imgH / 2

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

  const applyZoom = (newZoom: number) => {
    const z = clamp(newZoom, minZoom, maxZoom)
    const nW = naturalWidth * z
    const nH = naturalHeight * z
    const nMaxX = Math.max(0, (nW - CROP_D) / 2)
    const nMaxY = Math.max(0, (nH - CROP_D) / 2)
    setZoom(z)
    setOffset(prev => ({ x: clamp(prev.x, -nMaxX, nMaxX), y: clamp(prev.y, -nMaxY, nMaxY) }))
  }

  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setOffset({
        x: clamp(dragRef.current.ox + ev.clientX - dragRef.current.sx, -maxOffX, maxOffX),
        y: clamp(dragRef.current.oy + ev.clientY - dragRef.current.sy, -maxOffY, maxOffY),
      })
    }
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Non-passive wheel listener to enable preventDefault
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ zoom, minZoom, maxZoom, naturalWidth, naturalHeight })
  stateRef.current = { zoom, minZoom, maxZoom, naturalWidth, naturalHeight }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const { zoom, minZoom, maxZoom, naturalWidth, naturalHeight } = stateRef.current
      const z = clamp(zoom * (e.deltaY > 0 ? 0.93 : 1.07), minZoom, maxZoom)
      const nW = naturalWidth * z
      const nH = naturalHeight * z
      const nMaxX = Math.max(0, (nW - CROP_D) / 2)
      const nMaxY = Math.max(0, (nH - CROP_D) / 2)
      setZoom(z)
      setOffset(prev => ({ x: clamp(prev.x, -nMaxX, nMaxX), y: clamp(prev.y, -nMaxY, nMaxY) }))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const handleConfirm = () => {
    const OUT = 600
    const canvas = document.createElement('canvas')
    canvas.width = OUT
    canvas.height = OUT
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, -imgLeft / zoom, -imgTop / zoom, CROP_D / zoom, CROP_D / zoom, 0, 0, OUT, OUT)
      onConfirm(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.src = src
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-4 shadow-2xl max-w-[95vw]">
        <div className="text-center">
          <h3 className="text-foreground font-semibold text-base">Ajustar imagen</h3>
          <p className="text-muted-foreground text-xs mt-1">Arrastra para encuadrar · Slider o rueda del mouse para zoom</p>
        </div>

        {/* Ventana de recorte fija 600×600 */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg select-none cursor-grab active:cursor-grabbing"
          style={{ width: CROP_D, height: CROP_D }}
          onMouseDown={onMouseDown}
        >
          <img
            src={src}
            draggable={false}
            alt=""
            style={{ position: 'absolute', left: imgLeft, top: imgTop, width: imgW, height: imgH, maxWidth: 'none', display: 'block', pointerEvents: 'none' }}
          />
          {/* Marco fijo */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 border-2 border-dashed border-white/80" />
            {/* Guías de tercios */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute h-full border-r border-white" style={{ left: '33.33%' }} />
              <div className="absolute h-full border-r border-white" style={{ left: '66.66%' }} />
              <div className="absolute w-full border-b border-white" style={{ top: '33.33%' }} />
              <div className="absolute w-full border-b border-white" style={{ top: '66.66%' }} />
            </div>
            {/* Brackets de esquina */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-white" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-white" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-white" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-white" />
          </div>
        </div>

        {/* Slider de zoom */}
        <div className="flex items-center gap-3 w-full px-1">
          <span className="text-muted-foreground text-sm font-bold select-none leading-none">−</span>
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={0.0001}
            value={zoom}
            onChange={e => applyZoom(Number(e.target.value))}
            className="flex-1 h-1 rounded-full appearance-none bg-border cursor-pointer"
            style={{ accentColor: 'hsl(var(--accent))' }}
          />
          <span className="text-muted-foreground text-sm font-bold select-none leading-none">+</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="border-border text-foreground hover:bg-muted">Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-accent text-accent-foreground hover:opacity-90 glow-accent-btn">
            <Check className="h-4 w-4 mr-1.5" /> Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminInventory() {
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    price: "",
    size: "",
    vehicle: "",
    category: "",
    status: "",
    image: "",
    rating: "5"
  })

  const [quantities, setQuantities] = useState<number[]>(() => loadQuantitiesFromStorage().quantities)
  const [selectedQuantities, setSelectedQuantities] = useState<number[]>(() => loadQuantitiesFromStorage().selected)
  const [customQtyInput, setCustomQtyInput] = useState("")
  const [savedProducts, setSavedProducts] = useState<any[]>([])
  const [hiddenStatic, setHiddenStatic] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const editSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = () => {
      try {
        let custom = JSON.parse(localStorage.getItem("truckparts_custom_products") || "[]")
        const hidden = JSON.parse(localStorage.getItem("truckparts_hidden_static") || "[]")
        
        // MIGRATION: Sincronización automática de imágenes para productos base
        let changed = false
        const updated = custom.map((p: any) => {
          const staticMatch = staticProducts.find(sp => sp.id === p.id)
          if (staticMatch) {
            // Si la imagen actual no es una URL externa (HTTP), forzamos la nueva imagen CDN
            const isInvalidImage = !p.image || !p.image.startsWith('http')
            
            if (isInvalidImage) {
              p.image = staticMatch.image
              changed = true
            }
          }
          return p
        })

        if (changed) {
          localStorage.setItem("truckparts_custom_products", JSON.stringify(updated))
          custom = updated
        }

        setSavedProducts(custom)
        setHiddenStatic(hidden)
      } catch { setSavedProducts([]); setHiddenStatic([]) }
    }
    load()
    window.addEventListener('productsUpdated', load)
    return () => window.removeEventListener('productsUpdated', load)
  }, [])

  const handleDeleteProduct = (id: number, isStatic: boolean) => {
    if (isStatic) {
      const updated = [...hiddenStatic, id]
      localStorage.setItem("truckparts_hidden_static", JSON.stringify(updated))
      setHiddenStatic(updated)
    } else {
      const updated = savedProducts.filter(p => p.id !== id)
      localStorage.setItem("truckparts_custom_products", JSON.stringify(updated))
      setSavedProducts(updated)
    }
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleEditProduct = (product: any) => {
    setEditingId(product.id)
    setProductData({
      name: product.name || "",
      brand: product.customMarca || "",
      price: String(product.price || ""),
      size: product.customMedidas || "",
      vehicle: product.customVehiculo || "",
      category: product.category || "",
      status: product.badge || "",
      image: product.image || "",
      rating: String(Math.round(product.rating || 5))
    })
    setSelectedQuantities(product.saleQuantities || DEFAULT_SELECTED)
    setQuantities(prev => {
      const merged = [...new Set([...prev, ...(product.saleQuantities || [])])]
      return merged.sort((a, b) => a - b)
    })
    editSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  
  const handleCancelEdit = () => {
    setProductData({ name: "", brand: "", price: "", size: "", vehicle: "", category: "", status: "", image: "", rating: "5" })
    const saved = loadQuantitiesFromStorage()
    setQuantities(saved.quantities)
    setSelectedQuantities(saved.selected)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setEditingId(null)
    setSaved(false)
  }
  
  const [saved, setSaved] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [productsPerPage, setProductsPerPage] = useState(4)
  const [productPage, setProductPage] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropperData, setCropperData] = useState<{ src: string; w: number; h: number } | null>(null)

  const resetFileInput = () => { if (fileInputRef.current) fileInputRef.current.value = "" }

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onerror = () => URL.revokeObjectURL(objectUrl)
    img.onload = () => setCropperData({ src: objectUrl, w: img.naturalWidth || img.width, h: img.naturalHeight || img.height })
    img.src = objectUrl
  }

  const handleCropConfirm = (dataUrl: string) => {
    if (cropperData) URL.revokeObjectURL(cropperData.src)
    setCropperData(null)
    setProductData(prev => ({ ...prev, image: dataUrl }))
    setSaved(false)
  }

  const handleCropCancel = () => {
    if (cropperData) URL.revokeObjectURL(cropperData.src)
    setCropperData(null)
    resetFileInput()
  }

  const toggleQuantity = (qty: number) => {
    setSelectedQuantities(prev => {
      const updated = prev.includes(qty) ? prev.filter(q => q !== qty) : [...prev, qty].sort((a, b) => a - b)
      localStorage.setItem("truckparts_selected_quantities", JSON.stringify(updated))
      return updated
    })
  }

  const addCustomQuantity = () => {
    const qty = parseInt(customQtyInput)
    if (!qty || qty <= 0) return
    setQuantities(prev => {
      if (prev.includes(qty)) return prev
      const updated = [...prev, qty].sort((a, b) => a - b)
      localStorage.setItem("truckparts_quantities", JSON.stringify(updated))
      return updated
    })
    setSelectedQuantities(prev => {
      if (prev.includes(qty)) return prev
      const updated = [...prev, qty].sort((a, b) => a - b)
      localStorage.setItem("truckparts_selected_quantities", JSON.stringify(updated))
      return updated
    })
    setCustomQtyInput("")
  }

  const removeQuantity = (qty: number) => {
    setQuantities(prev => {
      const updated = prev.filter(q => q !== qty)
      localStorage.setItem("truckparts_quantities", JSON.stringify(updated))
      return updated
    })
    setSelectedQuantities(prev => {
      const updated = prev.filter(q => q !== qty)
      localStorage.setItem("truckparts_selected_quantities", JSON.stringify(updated))
      return updated
    })
  }

  const handleSaveProduct = () => {
    if (!productData.name || !productData.price || !productData.category) {
      alert("Por favor completa al menos el nombre, precio y categoría del producto.")
      return
    }

    const newProduct = {
      id: Date.now(), // Generate a unique ID
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price) || 0,
      originalPrice: null,
      rating: Math.round(parseFloat(productData.rating)) || 5,
      image: productData.image || "/products/filter.jpg", // Fallback image
      badge: productData.status || null,
      customMedidas: productData.size,
      customVehiculo: productData.vehicle,
      customMarca: productData.brand,
      saleQuantities: selectedQuantities
    }

    const existingProducts = JSON.parse(localStorage.getItem("truckparts_custom_products") || "[]")
    let updatedProducts;
    
    // Check if we are editing a static product (it wouldn't be in existingProducts yet)
    const isEditingStatic = editingId !== null && !existingProducts.some((p: any) => p.id === editingId)

    if (editingId !== null && !isEditingStatic) {
      // Editing an already custom product
      updatedProducts = existingProducts.map((p: any) => p.id === editingId ? { ...newProduct, id: editingId } : p)
    } else {
      // Creating new or editing a static template
      updatedProducts = [newProduct, ...existingProducts]
      
      if (isEditingStatic) {
        // If it was static, hide the original one
        const hidden = [...hiddenStatic, editingId]
        localStorage.setItem("truckparts_hidden_static", JSON.stringify(hidden))
        setHiddenStatic(hidden)
      }
    }

    try {
      localStorage.setItem("truckparts_custom_products", JSON.stringify(updatedProducts))
      setSaved(true)
      window.dispatchEvent(new Event('productsUpdated'))
      setTimeout(() => {
        setProductData({ name: "", brand: "", price: "", size: "", vehicle: "", category: "", status: "", image: "", rating: "5" })
        setQuantities(DEFAULT_QUANTITIES)
        setSelectedQuantities(DEFAULT_SELECTED)
        if (fileInputRef.current) fileInputRef.current.value = ""
        setSaved(false)
        setEditingId(null)
      }, 2000)
    } catch (e) {
      alert("Error al guardar: La imagen es demasiado grande para el almacenamiento local. Usa una imagen más pequeña.")
    }
  }


  const allProducts = [
    ...savedProducts,
    ...staticProducts.filter(p => !hiddenStatic.includes(p.id)).map(p => ({ ...p, _static: true }))
  ]

  return (
    <div className="flex flex-col gap-6" ref={editSectionRef}>

      {cropperData && (
        <ImageCropper
          src={cropperData.src}
          naturalWidth={cropperData.w}
          naturalHeight={cropperData.h}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

    <div className="flex flex-col xl:flex-row gap-6">
      {/* Formulario Izquierda */}
      <Card className="bg-card border-border flex-1">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {editingId !== null ? "Editando Producto" : "Agregar Nuevo Producto"}
          </CardTitle>
          <CardDescription>
            {editingId !== null ? "Modifica los datos del producto y guarda los cambios." : "Registra un producto para tu catálogo. Aparecerá en el carrusel web."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Nombre del Producto</Label>
              <Input 
                placeholder="Ej. Pastillas de Freno" 
                value={productData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Marca</Label>
              <Input 
                placeholder="Ej. Bosch" 
                value={productData.brand}
                onChange={e => handleInputChange('brand', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Precio (USD)</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                value={productData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Medidas</Label>
              <Input 
                placeholder="Ej. 15x5x2 cm" 
                value={productData.size}
                onChange={e => handleInputChange('size', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Vehículo Compatible</Label>
              <Input 
                placeholder="Ej. Ford F-150" 
                value={productData.vehicle}
                onChange={e => handleInputChange('vehicle', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Categoría (Parte)</Label>
              <Select value={productData.category} onValueChange={val => handleInputChange('category', val)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Seleccione una categoría..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motor">Motor</SelectItem>
                  <SelectItem value="Suspensión">Suspensión y Dirección</SelectItem>
                  <SelectItem value="Frenos">Frenos</SelectItem>
                  <SelectItem value="Transmisión">Transmisión</SelectItem>
                  <SelectItem value="Eléctrico">Sistema Eléctrico</SelectItem>
                  <SelectItem value="Carrocería">Carrocería</SelectItem>
                  <SelectItem value="Refrigeración">Refrigeración</SelectItem>
                  <SelectItem value="Accesorios">Accesorios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Estado / Etiqueta</Label>
              <Select value={productData.status} onValueChange={val => handleInputChange('status', val)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Seleccione una etiqueta..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Usado">Usado</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Oferta">Oferta</SelectItem>
                  <SelectItem value="En Stock">En Stock</SelectItem>
                  <SelectItem value="Agotado">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-accent" /> Calificación (1 - 5)
              </Label>
              <Input 
                type="number" 
                step="1"
                min="1"
                max="5"
                placeholder="5" 
                value={productData.rating}
                onChange={e => handleInputChange('rating', e.target.value)}
                className="bg-input border-border text-foreground w-24"
              />
            </div>
          </div>
          
          {/* Cantidades de Venta */}
          <div className="space-y-3 pt-2 border-t border-border mt-4">
            <div>
              <Label className="text-foreground">Cantidades de Venta (Opciones para el cliente)</Label>
              <p className="text-xs text-muted-foreground mt-1">Selecciona los tamaños que deseas ofrecer o agrega/elimina opciones.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quantities.map(qty => (
                <div
                  key={qty}
                  className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border transition-all select-none
                    ${selectedQuantities.includes(qty)
                      ? "bg-accent/10 border-accent/50 text-foreground"
                      : "bg-input/50 border-border text-muted-foreground opacity-60 hover:opacity-100"
                    }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => toggleQuantity(qty)}>
                    <Checkbox
                      checked={selectedQuantities.includes(qty)}
                      onCheckedChange={() => toggleQuantity(qty)}
                    />
                    <span className="text-sm font-medium">{qty} {qty === 1 ? "und" : "unds"}</span>
                  </label>
                  <button
                    type="button"
                    title="Eliminar opción"
                    className="p-0.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                    onClick={() => removeQuantity(qty)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Otra cantidad..."
                value={customQtyInput}
                onChange={e => setCustomQtyInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCustomQuantity()}
                className="bg-input border-border text-foreground w-36"
                min={1}
              />
              <Button
                type="button"
                onClick={addCustomQuantity}
                className="bg-accent text-accent-foreground hover:opacity-90 border-accent glow-accent-btn"
              >
                <Plus className="h-4 w-4 mr-1" /> Agregar
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border mt-4">
            <Label className="text-foreground">Imagen del Producto</Label>
            <Input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="bg-input border-border text-foreground cursor-pointer"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleSaveProduct} 
              className="flex-1 bg-accent text-accent-foreground hover:opacity-90 transition-all font-bold glow-accent-btn"
            >
              {saved ? <><Check className="mr-2 h-4 w-4" /> {editingId !== null ? "Guardado" : "Registrado"}</> : <><Save className="mr-2 h-4 w-4" /> {editingId !== null ? "Guardar" : "Registrar"}</>}
            </Button>
            {editingId !== null && (
              <Button 
                variant="outline" 
                onClick={handleCancelEdit} 
                className="border-border text-foreground hover:bg-muted"
              >
                Cancelar
              </Button>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Previsualización Derecha */}
      <Card className="bg-card border-border w-full xl:w-[400px] shrink-0 overflow-hidden shadow-xl">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-lg text-foreground text-center">
            Vista Previa de Tarjeta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-background flex flex-col items-center justify-center min-h-[400px]">
          
          <div className="w-full max-w-[280px]">
            <Card className="group bg-secondary/20 border-secondary/30 card-glow h-full backdrop-blur-sm transition-all hover:bg-secondary/30 cursor-default">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative aspect-square bg-secondary/40 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  {productData.image ? (
                    <img 
                      src={productData.image} 
                      alt="Preview" 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                       <ImageIcon className="h-10 w-10 opacity-30" />
                    </div>
                  )}

                  {productData.status && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg glow-accent-btn">
                      {productData.status}
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    disabled
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground z-10 glow-accent-btn hover:bg-accent cursor-default"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {productData.category || "Categoría"}
                  </p>
                  <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
                    {productData.name || "Nombre del Producto"}
                  </h3>
                  
                  {/* Rating Dummy */}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {parseInt(productData.rating || "5")}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      ${parseFloat(productData.price || "0").toFixed(2)}
                    </span>
                  </div>

                  {/* Sale Quantities */}
                  {selectedQuantities.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedQuantities.map(qty => (
                        <span
                          key={qty}
                          className="px-2 py-0.5 rounded border border-accent text-accent text-[10px] font-medium"
                        >
                          {qty} {qty === 1 ? "und" : "unds"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Detailed Specs */}
                  <div className="pt-3 mt-3 border-t border-border/40 flex flex-col gap-1.5 text-[11px] text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Marca</span>
                      <span className="text-foreground max-w-[120px] truncate text-right">{productData.brand || "Genérica"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Medidas</span>
                      <span className="text-foreground max-w-[120px] truncate text-right">{productData.size || "Estándar"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Vehículo</span>
                      <span className="text-foreground max-w-[120px] truncate text-right">{productData.vehicle || "Universal"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>

    {/* Productos Registrados */}
    <Card className="bg-card border-border mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Productos en el Carrusel
              </CardTitle>
              <CardDescription className="mt-1">
                {allProducts.length} producto{allProducts.length !== 1 ? "s" : ""} en total. Elimina los personalizados que ya no quieras mostrar.
              </CardDescription>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={productSearch}
                  onChange={e => { setProductSearch(e.target.value); setProductPage(1) }}
                  placeholder="Buscar producto..."
                  className="pl-9 pr-8 h-9 text-sm bg-input border-border"
                />
                {productSearch && (
                  <button
                    onClick={() => { setProductSearch(""); setProductPage(1) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select
                value={String(productsPerPage)}
                onValueChange={(v) => { setProductsPerPage(Number(v)); setProductPage(1) }}
              >
                <SelectTrigger className="w-20 h-9 bg-input border-border text-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const filtered = productSearch.trim()
              ? allProducts.filter(p =>
                  p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(productSearch.toLowerCase())
                )
              : allProducts
            const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage))
            const safePage = Math.min(productPage, totalPages)
            const paginated = filtered.slice((safePage - 1) * productsPerPage, safePage * productsPerPage)

            if (filtered.length === 0) return (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Search className="h-8 w-8 opacity-20" />
                <p className="text-sm">No se encontraron productos para &quot;{productSearch}&quot;</p>
              </div>
            )
            return (
              <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map(product => (
              <div key={product.id} className="relative group">
                <Card className="bg-secondary/20 border-secondary/30 h-full">
                  <CardContent className="p-3">
                    {/* Image */}
                    <div className="relative aspect-square bg-secondary/40 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <NextImage
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized={product.image.endsWith(".svg")}
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 opacity-20 text-muted-foreground" />
                      )}
                      {product.badge && (
                        <Badge className="absolute top-1.5 left-1.5 bg-accent text-accent-foreground text-[9px] font-bold uppercase tracking-wider shadow-lg">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    {/* Info */}
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{product.category || "—"}</p>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-1 mt-0.5">{product.name}</h3>
                    <p className="text-base font-bold text-foreground mt-1">${parseFloat(product.price).toFixed(2)}</p>
                    {product.saleQuantities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {product.saleQuantities.map((qty: number) => (
                          <span key={qty} className="px-1.5 py-0.5 rounded border border-accent text-accent text-[9px] font-medium">
                            {qty} {qty === 1 ? "und" : "unds"}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Actions */}
                    <div className="flex gap-1.5 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-accent text-accent-foreground hover:opacity-90 glow-accent-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex-1 h-7 text-xs">
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar <strong>"{product.name}"</strong> del inventario? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              onClick={() => handleDeleteProduct(product.id, !!(product as any)._static)}
                            >
                              Sí, eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {filtered.length > productsPerPage && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {(safePage - 1) * productsPerPage + 1}–{Math.min(safePage * productsPerPage, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-border"
                  disabled={safePage <= 1}
                  onClick={() => setProductPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-foreground px-2">{safePage} / {totalPages}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-border"
                  disabled={safePage >= totalPages}
                  onClick={() => setProductPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
              </>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}

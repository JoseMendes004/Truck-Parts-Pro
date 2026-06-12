"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Loader2, Trash2, Save, Upload, Check, ChevronsUpDown, Type, Pencil, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TypografiaSectionProps {
  onPreviewTypographyChange: (typography: any) => void
}

export function TypografiaSection({ onPreviewTypographyChange }: TypografiaSectionProps) {
  const { globalTypography, setGlobalTypography, customFonts, addCustomFont, removeCustomFont, updateCustomFont } = useTheme()

  const [hiddenDefaultFontIds, setHiddenDefaultFontIds] = useState<string[]>([])
  const [defaultFontOverride, setDefaultFontOverride] = useState<{ name: string; headingSize: string; bodySize: string } | null>(null)
  const defaultFont = { id: "default-geist", name: defaultFontOverride?.name ?? "Geist", fontFamily: "Geist", isDefault: true, headingSize: defaultFontOverride?.headingSize ?? "1.0", bodySize: defaultFontOverride?.bodySize ?? "1.0" }
  const allFonts = [
    ...(hiddenDefaultFontIds.includes("default-geist") ? [] : [defaultFont]),
    ...customFonts.map((f) => ({ ...f, isDefault: false }))
  ]

  const [previewTypography, setPreviewTypography] = useState(globalTypography)
  const [newFontName, setNewFontName] = useState("")
  const [uploadingFont, setUploadingFont] = useState(false)
  const [fontSaved, setFontSaved] = useState(false)
  const [openFontHeading, setOpenFontHeading] = useState(false)
  const [openFontBody, setOpenFontBody] = useState(false)
  const [editingFontId, setEditingFontId] = useState<string | null>(null)
  const [editingFontName, setEditingFontName] = useState("")
  const [replacingFontFile, setReplacingFontFile] = useState(false)
  const [newHeadingSize, setNewHeadingSize] = useState("1.0")
  const [newBodySize, setNewBodySize] = useState("1.0")
  const [editingHeadingSize, setEditingHeadingSize] = useState("1.0")
  const [editingBodySize, setEditingBodySize] = useState("1.0")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fontSearch, setFontSearch] = useState("")
  const [fontsPerPage, setFontsPerPage] = useState(5)
  const [fontPage, setFontPage] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem("truck-parts-hidden-default-fonts")
    if (saved) {
      try { setHiddenDefaultFontIds(JSON.parse(saved)) } catch {}
    }
    const savedOverride = localStorage.getItem("truck-parts-default-font-override")
    if (savedOverride) {
      try { setDefaultFontOverride(JSON.parse(savedOverride)) } catch {}
    }
  }, [])

  useEffect(() => {
    setPreviewTypography(globalTypography)
  }, [globalTypography])

  useEffect(() => {
    onPreviewTypographyChange(previewTypography)
  }, [previewTypography, onPreviewTypographyChange])

  const handleFontUpload = async () => {
    if (!selectedFile || !newFontName.trim()) return

    setUploadingFont(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const fontId = `custom-font-${Date.now()}`
      const fontFamily = newFontName.trim().replace(/\s+/g, "-")
      addCustomFont({
        id: fontId,
        name: newFontName.trim(),
        fontFamily,
        dataUrl,
        headingSize: newHeadingSize,
        bodySize: newBodySize
      })
      setNewFontName("")
      setNewHeadingSize("1.0")
      setNewBodySize("1.0")
      setSelectedFile(null)
      setUploadingFont(false)
      
      const fileInput = document.getElementById("new-font-file-input") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
    reader.onerror = () => setUploadingFont(false)
    reader.readAsDataURL(selectedFile)
  }

  const handleStartEdit = (font: any) => {
    setEditingFontId(font.id)
    setEditingFontName(font.name)
    setEditingHeadingSize(font.headingSize || "1.0")
    setEditingBodySize(font.bodySize || "1.0")
  }

  const handleSaveEdit = (font: any) => {
    if (!editingFontName.trim()) return

    if (font.isDefault) {
      const override = { name: editingFontName.trim(), headingSize: editingHeadingSize, bodySize: editingBodySize }
      setDefaultFontOverride(override)
      localStorage.setItem("truck-parts-default-font-override", JSON.stringify(override))
      setPreviewTypography((prev: any) => {
        const next = { ...prev }
        if (prev.headingFont === font.fontFamily) next.headingSize = editingHeadingSize
        if (prev.bodyFont === font.fontFamily) next.bodySize = editingBodySize
        return next
      })
    } else {
      const newFontFamily = editingFontName.trim().replace(/\s+/g, "-")
      const oldFontFamily = font.fontFamily
      updateCustomFont(font.id, {
        name: editingFontName.trim(),
        fontFamily: newFontFamily,
        headingSize: editingHeadingSize,
        bodySize: editingBodySize,
      })
      setPreviewTypography((prev: any) => {
        const next = { ...prev }
        if (prev.headingFont === oldFontFamily) { next.headingFont = newFontFamily; next.headingSize = editingHeadingSize }
        if (prev.bodyFont === oldFontFamily) { next.bodyFont = newFontFamily; next.bodySize = editingBodySize }
        return next
      })
    }

    setEditingFontId(null)
    setEditingFontName("")
    setEditingHeadingSize("1.0")
    setEditingBodySize("1.0")
  }

  const handleCancelEdit = () => {
    setEditingFontId(null)
    setEditingFontName("")
    setEditingHeadingSize("1.0")
    setEditingBodySize("1.0")
  }

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>, fontId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReplacingFontFile(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      updateCustomFont(fontId, { dataUrl })
      setReplacingFontFile(false)
      e.target.value = ""
    }
    reader.onerror = () => setReplacingFontFile(false)
    reader.readAsDataURL(file)
  }

  const handleRemoveFont = (font: any) => {
    if (font.isDefault) {
      const updated = [...hiddenDefaultFontIds, font.id]
      setHiddenDefaultFontIds(updated)
      localStorage.setItem("truck-parts-hidden-default-fonts", JSON.stringify(updated))
      setPreviewTypography((prev: any) => {
        const next = { ...prev }
        if (prev.headingFont === font.fontFamily) next.headingFont = ""
        if (prev.bodyFont === font.fontFamily) next.bodyFont = ""
        return next
      })
    } else {
      removeCustomFont(font.id)
    }
  }

  const handleSaveFont = () => {
    setGlobalTypography(previewTypography)
    setFontSaved(true)
    setTimeout(() => setFontSaved(false), 2000)
  }

  const updateTypography = (key: string, value: any) => {
    setPreviewTypography((p: any) => ({ ...p, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Subir Fuente */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Agregar Nueva Tipografía
          </CardTitle>
          <CardDescription>Sube un archivo TTF para agregar una fuente personalizada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Archivo TTF</Label>
            <div className="flex gap-2">
              <Input
                id="new-font-file-input"
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedFile(file)
                    // Auto-suggest font name based on file name
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                    const suggestedName = baseName.replace(/[-_]/g, ' ')
                    setNewFontName(suggestedName)
                  }
                }}
                disabled={uploadingFont}
                className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
              />
              <style dangerouslySetInnerHTML={{ __html: `input[type="file"]::file-selector-button { background-color: var(--accent); }` }} />
            </div>
            {!selectedFile && (
              <p className="text-xs text-muted-foreground">Primero selecciona un archivo de fuente para configurarlo</p>
            )}
            {uploadingFont && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo fuente...
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre de la Fuente</Label>
                <Input
                  placeholder="Ej: Mi Fuente Personalizada"
                  value={newFontName}
                  onChange={(e) => setNewFontName(e.target.value)}
                  disabled={uploadingFont}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <span className="font-bold">H</span> Tamaño Título (mult)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border text-foreground bg-input hover:bg-muted"
                      onClick={() => setNewHeadingSize((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(1))}
                      disabled={uploadingFont}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newHeadingSize}
                      onChange={(e) => setNewHeadingSize(e.target.value)}
                      disabled={uploadingFont}
                      className="bg-input border-border text-foreground text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border text-foreground bg-input hover:bg-muted"
                      onClick={() => setNewHeadingSize((prev) => (parseFloat(prev) + 0.1).toFixed(1))}
                      disabled={uploadingFont}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <span className="font-bold">H</span> Tamaño Subtítulo (mult)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border text-foreground bg-input hover:bg-muted"
                      onClick={() => setNewBodySize((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(1))}
                      disabled={uploadingFont}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newBodySize}
                      onChange={(e) => setNewBodySize(e.target.value)}
                      disabled={uploadingFont}
                      className="bg-input border-border text-foreground text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border text-foreground bg-input hover:bg-muted"
                      onClick={() => setNewBodySize((prev) => (parseFloat(prev) + 0.1).toFixed(1))}
                      disabled={uploadingFont}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    setNewFontName("")
                    setNewHeadingSize("1.0")
                    setNewBodySize("1.0")
                    const fileInput = document.getElementById("new-font-file-input") as HTMLInputElement
                    if (fileInput) fileInput.value = ""
                  }}
                  disabled={uploadingFont}
                  className="w-1/3 border-border text-foreground bg-input hover:bg-muted hover:text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleFontUpload}
                  disabled={!newFontName.trim() || uploadingFont}
                  className="w-2/3 text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {uploadingFont ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Guardar Tipografía</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurador de Tipografías */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Configurador de Tipografías
          </CardTitle>
          <CardDescription>Asigna fuentes y tamaños para títulos y subtítulos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector fuente Título */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Seleccionar fuente para TÍTULO (.ttf)</Label>
            <Popover open={openFontHeading} onOpenChange={setOpenFontHeading}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openFontHeading} className="w-full justify-between bg-input border-border text-foreground h-12">
                  {previewTypography.headingFont ? allFonts.find((f) => f.fontFamily === previewTypography.headingFont)?.name : "Seleccionar fuente..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-border">
                <Command className="bg-card">
                  <CommandInput placeholder="Buscar fuente..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró la fuente.</CommandEmpty>
                    <CommandGroup>
                      {allFonts.map((font) => (
                        <CommandItem
                          key={font.id}
                          value={font.name}
                          onSelect={() => {
                            updateTypography("headingFont", font.fontFamily)
                            if (font.headingSize) {
                              updateTypography("headingSize", font.headingSize)
                            }
                            setOpenFontHeading(false)
                          }}
                          className="cursor-pointer"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", previewTypography.headingFont === font.fontFamily ? "opacity-100" : "opacity-0")} />
                          {font.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selector fuente Subtítulo */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Seleccionar fuente para SUBTÍTULO y PÁRRAFO (.ttf)</Label>
            <Popover open={openFontBody} onOpenChange={setOpenFontBody}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openFontBody} className="w-full justify-between bg-input border-border text-foreground h-12">
                  {previewTypography.bodyFont ? allFonts.find((f) => f.fontFamily === previewTypography.bodyFont)?.name : "Seleccionar fuente..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-border">
                <Command className="bg-card">
                  <CommandInput placeholder="Buscar fuente..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró la fuente.</CommandEmpty>
                    <CommandGroup>
                      {allFonts.map((font) => (
                        <CommandItem
                          key={font.id}
                          value={font.name}
                          onSelect={() => {
                            updateTypography("bodyFont", font.fontFamily)
                            if (font.bodySize) {
                              updateTypography("bodySize", font.bodySize)
                            }
                            setOpenFontBody(false)
                          }}
                          className="cursor-pointer"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", previewTypography.bodyFont === font.fontFamily ? "opacity-100" : "opacity-0")} />
                          {font.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Tamaños de Fuente */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleSaveFont}
              disabled={JSON.stringify(previewTypography) === JSON.stringify(globalTypography)}
              className="w-full text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {fontSaved ? (
                <><Check className="mr-2 h-4 w-4" />Guardado</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Guardar Configuración</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fuentes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Mis Tipografías
          </CardTitle>
          <CardDescription>Selecciona una fuente para previsualizarla y guarda para aplicarla</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de búsqueda y selector de cantidad */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar tipografía..."
                value={fontSearch}
                onChange={(e) => { setFontSearch(e.target.value); setFontPage(1) }}
                className="pl-8 bg-input border-border text-foreground"
              />
            </div>
            <Select
              value={String(fontsPerPage)}
              onValueChange={(v) => { setFontsPerPage(Number(v)); setFontPage(1) }}
            >
              <SelectTrigger className="w-20 bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(() => {
            const filtered = allFonts.filter((f) => f.name.toLowerCase().includes(fontSearch.toLowerCase()))
            const totalPages = Math.max(1, Math.ceil(filtered.length / fontsPerPage))
            const safePage = Math.min(fontPage, totalPages)
            const paginated = filtered.slice((safePage - 1) * fontsPerPage, safePage * fontsPerPage)

            return (
              <>
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg border-border">
                {allFonts.length === 0 ? "No hay tipografías instaladas" : "No se encontraron tipografías"}
              </div>
            ) : (
              paginated.map((font) => {
                const isUsed = previewTypography.headingFont === font.fontFamily || previewTypography.bodyFont === font.fontFamily
                const isEditing = editingFontId === font.id
                return (
                  <div key={font.id} className={`p-3 rounded-lg border transition-colors ${isEditing ? "bg-muted/50 border-primary" : isUsed ? "bg-primary/10 border-primary" : "bg-muted/50 border-border"}`}>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Nombre de la fuente</Label>
                          <Input
                            value={editingFontName}
                            onChange={(e) => setEditingFontName(e.target.value)}
                            className="bg-input border-border text-foreground h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(font); if (e.key === "Escape") handleCancelEdit() }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="font-bold">H</span> Título (mult)
                            </Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-border text-foreground bg-input"
                                onClick={() => setEditingHeadingSize((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(1))}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={editingHeadingSize}
                                onChange={(e) => setEditingHeadingSize(e.target.value)}
                                className="bg-input border-border text-foreground text-center h-7 text-xs p-1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-border text-foreground bg-input"
                                onClick={() => setEditingHeadingSize((prev) => (parseFloat(prev) + 0.1).toFixed(1))}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="font-bold">H</span> Subtítulo (mult)
                            </Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-border text-foreground bg-input"
                                onClick={() => setEditingBodySize((prev) => Math.max(0.1, parseFloat(prev) - 0.1).toFixed(1))}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={editingBodySize}
                                onChange={(e) => setEditingBodySize(e.target.value)}
                                className="bg-input border-border text-foreground text-center h-7 text-xs p-1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-border text-foreground bg-input"
                                onClick={() => setEditingBodySize((prev) => (parseFloat(prev) + 0.1).toFixed(1))}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        {!font.isDefault && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Reemplazar archivo (opcional)</Label>
                            <Input
                              type="file"
                              accept=".ttf,.otf,.woff,.woff2"
                              onChange={(e) => handleReplaceFile(e, font.id)}
                              disabled={replacingFontFile}
                              className="bg-input border-border text-foreground text-xs file:text-white file:border-0 file:rounded file:px-2 file:py-0.5 file:mr-2 file:cursor-pointer file:hover:opacity-90 h-8"
                            />
                            {replacingFontFile && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" /> Reemplazando...
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2 justify-end pt-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleCancelEdit}>
                            <X className="h-3 w-3 mr-1" /> Cancelar
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs text-white hover:opacity-90"
                            style={{ backgroundColor: "var(--accent)" }}
                            onClick={() => handleSaveEdit(font)}
                            disabled={!editingFontName.trim()}
                          >
                            <Save className="h-3 w-3 mr-1" /> Guardar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isUsed ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                            {isUsed && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div>
                            <p className="font-medium text-foreground" style={{ fontFamily: font.fontFamily }}>{font.name}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border" onClick={(e) => { e.stopPropagation(); handleStartEdit(font) }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {isUsed ? "¿Eliminar tipografía en uso?" : "¿Eliminar tipografía?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isUsed
                                    ? <>La tipografía <strong>"{font.name}"</strong> está aplicada actualmente en el sitio. Si la eliminas, el texto volverá a la fuente predeterminada. ¿Estás seguro?</>
                                    : <>¿Estás seguro de que deseas eliminar la tipografía <strong>"{font.name}"</strong>? Esta acción no se puede deshacer.</>
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  onClick={() => handleRemoveFont(font)}
                                >
                                  Sí, eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Paginación */}
          {filtered.length > fontsPerPage && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {(safePage - 1) * fontsPerPage + 1}–{Math.min(safePage * fontsPerPage, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-border"
                  disabled={safePage <= 1}
                  onClick={() => setFontPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-foreground px-2">{safePage} / {totalPages}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-border"
                  disabled={safePage >= totalPages}
                  onClick={() => setFontPage((p) => p + 1)}
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

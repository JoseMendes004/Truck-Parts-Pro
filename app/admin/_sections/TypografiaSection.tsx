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
import { Loader2, Trash2, Save, Upload, Check, ChevronsUpDown, Type } from "lucide-react"

interface TypografiaSectionProps {
  onPreviewTypographyChange: (typography: any) => void
}

export function TypografiaSection({ onPreviewTypographyChange }: TypografiaSectionProps) {
  const { globalTypography, setGlobalTypography, customFonts, addCustomFont, removeCustomFont } = useTheme()

  const defaultFont = { id: "default-geist", name: "Geist", fontFamily: "Geist", isDefault: true }
  const allFonts = [defaultFont, ...customFonts.map((f) => ({ ...f, isDefault: false }))]

  const [previewTypography, setPreviewTypography] = useState(globalTypography)
  const [newFontName, setNewFontName] = useState("")
  const [uploadingFont, setUploadingFont] = useState(false)
  const [fontSaved, setFontSaved] = useState(false)
  const [openFontHeading, setOpenFontHeading] = useState(false)
  const [openFontBody, setOpenFontBody] = useState(false)

  useEffect(() => {
    setPreviewTypography(globalTypography)
  }, [globalTypography])

  useEffect(() => {
    onPreviewTypographyChange(previewTypography)
  }, [previewTypography, onPreviewTypographyChange])

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !newFontName.trim()) return

    setUploadingFont(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const fontId = `custom-font-${Date.now()}`
      const fontFamily = newFontName.trim().replace(/\s+/g, "-")
      addCustomFont({ id: fontId, name: newFontName.trim(), fontFamily, dataUrl })
      setNewFontName("")
      setUploadingFont(false)
      e.target.value = ""
    }
    reader.onerror = () => setUploadingFont(false)
    reader.readAsDataURL(file)
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
            <Label className="text-foreground">Nombre de la Fuente</Label>
            <Input
              placeholder="Ej: Mi Fuente Personalizada"
              value={newFontName}
              onChange={(e) => setNewFontName(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Archivo TTF</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFontUpload}
                disabled={!newFontName.trim() || uploadingFont}
                className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
              />
              <style dangerouslySetInnerHTML={{ __html: `input[type="file"]::file-selector-button { background-color: var(--accent); }` }} />
            </div>
            {!newFontName.trim() && (
              <p className="text-xs text-muted-foreground">Primero ingresa un nombre para la fuente</p>
            )}
            {uploadingFont && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo fuente...
              </div>
            )}
          </div>
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
                        <CommandItem key={font.id} value={font.name} onSelect={() => { updateTypography("headingFont", font.fontFamily); setOpenFontHeading(false) }} className="cursor-pointer" style={{ fontFamily: font.fontFamily }}>
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
                        <CommandItem key={font.id} value={font.name} onSelect={() => { updateTypography("bodyFont", font.fontFamily); setOpenFontBody(false) }} className="cursor-pointer" style={{ fontFamily: font.fontFamily }}>
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
            <div className="flex items-center gap-2 mb-4">
              <Type className="h-5 w-5 text-primary" />
              <h3 className="text-foreground font-bold">Tamaños de Fuente</h3>
            </div>
            <div className="space-y-4">
              {(
                [
                  { key: "headingSize", label: "Titulo (px)" },
                  { key: "bodySize", label: "Subtitulo (px)" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <span className="font-bold">H</span> {label}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 border-border" onClick={() => updateTypography(key, (parseFloat(previewTypography[key]) - 0.1).toFixed(1))}>-</Button>
                    <Input type="number" step="0.1" value={previewTypography[key]} onChange={(e) => updateTypography(key, e.target.value)} className="bg-input border-border text-foreground text-center" />
                    <Button variant="outline" size="icon" className="h-10 w-10 border-border" onClick={() => updateTypography(key, (parseFloat(previewTypography[key]) + 0.1).toFixed(1))}>+</Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveFont}
              disabled={JSON.stringify(previewTypography) === JSON.stringify(globalTypography)}
              className="w-full mt-6 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {fontSaved ? (
                <><Check className="mr-2 h-4 w-4" />Guardado</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Guardar Tipografía</>
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
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allFonts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg border-border">
                No hay tipografías instaladas
              </div>
            ) : (
              allFonts.map((font) => {
                const isUsed = previewTypography.headingFont === font.fontFamily || previewTypography.bodyFont === font.fontFamily
                return (
                  <div key={font.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${isUsed ? "bg-primary/10 border-primary" : "bg-muted/50 border-border hover:bg-muted"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isUsed ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                        {isUsed && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground" style={{ fontFamily: font.fontFamily }}>{font.name}</p>
                        {font.isDefault && <p className="text-xs text-muted-foreground">Predeterminada</p>}
                      </div>
                    </div>
                    {!font.isDefault && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm("¿Estás seguro de que deseas eliminar esta tipografía? Esta acción no se puede deshacer.")) {
                            removeCustomFont(font.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

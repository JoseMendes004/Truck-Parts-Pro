"use client"

import { useState, useRef, useEffect } from "react"
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
import { Plus, Trash2, Save, Palette, Check, Search, ChevronsUpDown } from "lucide-react"

interface PreviewTheme {
  name: string
  colors: {
    primary: string
    accent: string
    background: string
    foreground: string
  }
  font: string
  mode?: "light" | "dark" | "colorblind"
}

interface ColoresSectionProps {
  onPreviewChange: (theme: PreviewTheme) => void
}

const DEFAULT_THEME: PreviewTheme = {
  name: "",
  colors: {
    primary: "#dc4a1a",
    accent: "#dc4a1a",
    background: "#fafafa",
    foreground: "#1a1a1a",
  },
  font: "Geist",
}

export function ColoresSection({ onPreviewChange }: ColoresSectionProps) {
  const {
    customThemes,
    addCustomTheme,
    removeCustomTheme,
    updateCustomTheme,
    applyTheme,
    modeThemeAssignment,
    setModeThemeAssignment,
  } = useTheme()

  const [newTheme, setNewTheme] = useState<PreviewTheme>(DEFAULT_THEME)
  const [selectedMode, setSelectedMode] = useState<"light" | "dark" | "colorblind">("light")
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null)
  const [themeSearchTerm, setThemeSearchTerm] = useState("")
  const [openLight, setOpenLight] = useState(false)
  const [openDark, setOpenDark] = useState(false)
  const [openColorblind, setOpenColorblind] = useState(false)
  const contentTopRef = useRef<HTMLDivElement>(null)
  const prevEditingRef = useRef<string | null>(null)

  useEffect(() => {
    if (editingThemeId !== null && prevEditingRef.current === null) {
      contentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    prevEditingRef.current = editingThemeId
  }, [editingThemeId])

  const handleColorChange = (key: keyof PreviewTheme["colors"], value: string) => {
    const updated = { ...newTheme, colors: { ...newTheme.colors, [key]: value } }
    setNewTheme(updated)
    onPreviewChange(updated)
  }

  const handleAddTheme = () => {
    if (!newTheme.name.trim()) return

    if (editingThemeId) {
      updateCustomTheme(editingThemeId, {
        name: newTheme.name,
        colors: newTheme.colors,
        font: newTheme.font,
      })
      setEditingThemeId(null)
    } else {
      addCustomTheme({
        id: `custom-${Date.now()}`,
        name: newTheme.name,
        colors: newTheme.colors,
        font: newTheme.font,
        mode: selectedMode,
      })
    }

    setNewTheme(DEFAULT_THEME)
    setSelectedMode("light")
    onPreviewChange(DEFAULT_THEME)
  }

  const startEditing = (theme: any) => {
    setEditingThemeId(theme.id)
    const t: PreviewTheme = {
      name: theme.name,
      colors: {
        primary: theme.colors.primary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        foreground: theme.colors.foreground,
      },
      font: theme.font || "Geist",
    }
    setNewTheme(t)
    onPreviewChange(t)
  }

  const cancelEditing = () => {
    setEditingThemeId(null)
    setNewTheme(DEFAULT_THEME)
    onPreviewChange(DEFAULT_THEME)
  }

  const filteredThemes = customThemes.filter((t) =>
    t.name.toLowerCase().includes(themeSearchTerm.toLowerCase())
  )

  return (
    <div ref={contentTopRef} className="space-y-6">
      {/* Crear / Editar Tema */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            {editingThemeId ? <Palette className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {editingThemeId ? "Editar Tema" : "Crear Nuevo Tema"}
          </CardTitle>
          <CardDescription>
            {editingThemeId ? "Modifica los colores de este tema" : "Define una nueva paleta de colores para la aplicación"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="themeName" className="text-foreground">Nombre del Tema</Label>
            <Input
              id="themeName"
              placeholder="Mi tema personalizado"
              value={newTheme.name}
              onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Color Principal */}
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Color Principal</Label>
              <div className="flex gap-2">
                <Input type="color" value={newTheme.colors.primary} onChange={(e) => handleColorChange("primary", e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={newTheme.colors.primary} onChange={(e) => handleColorChange("primary", e.target.value)} className="bg-input border-border text-foreground flex-1" />
              </div>
            </div>

            {/* Color de Acento */}
            <div className="space-y-2">
              <Label className="text-foreground">Color de Acento</Label>
              <div className="flex gap-2">
                <Input type="color" value={newTheme.colors.accent} onChange={(e) => handleColorChange("accent", e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={newTheme.colors.accent} onChange={(e) => handleColorChange("accent", e.target.value)} className="bg-input border-border text-foreground flex-1" />
              </div>
            </div>

            {/* Fondo */}
            <div className="space-y-2">
              <Label className="text-foreground">Fondo</Label>
              <div className="flex gap-2">
                <Input type="color" value={newTheme.colors.background} onChange={(e) => handleColorChange("background", e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={newTheme.colors.background} onChange={(e) => handleColorChange("background", e.target.value)} className="bg-input border-border text-foreground flex-1" />
              </div>
            </div>

            {/* Color de Texto */}
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Color de Texto</Label>
              <div className="flex gap-2">
                <Input type="color" value={newTheme.colors.foreground} onChange={(e) => handleColorChange("foreground", e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={newTheme.colors.foreground} onChange={(e) => handleColorChange("foreground", e.target.value)} className="bg-input border-border text-foreground flex-1" />
              </div>
            </div>

            {/* Modo */}
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Modo de Tema</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "colorblind"] as const).map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={selectedMode === m ? "default" : "outline"}
                    onClick={() => setSelectedMode(m)}
                    className="text-xs"
                  >
                    {m === "light" ? "Claro" : m === "dark" ? "Oscuro" : "Daltónico"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddTheme}
              disabled={!newTheme.name.trim()}
              className="flex-1 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {editingThemeId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingThemeId ? "Guardar Cambios" : "Agregar Tema"}
            </Button>
            {editingThemeId && (
              <Button onClick={cancelEditing} variant="outline" className="border-border text-foreground">
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asignación de Temas por Modo */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Asignación de Temas por Modo</CardTitle>
          <CardDescription>Elige qué tema usar para cada modo de visualización</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { key: "light", label: "Modo Claro", open: openLight, setOpen: setOpenLight },
              { key: "dark", label: "Modo Oscuro", open: openDark, setOpen: setOpenDark },
              { key: "colorblind", label: "Modo Daltónico", open: openColorblind, setOpen: setOpenColorblind },
            ] as const
          ).map(({ key, label, open, setOpen }) => (
            <div key={key} className="space-y-2">
              <Label className="text-foreground">Tema para {label}</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-input border-border text-foreground"
                  >
                    {modeThemeAssignment[key]
                      ? customThemes.find((t) => t.id === modeThemeAssignment[key])?.name
                      : "Seleccionar tema..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-border">
                  <Command className="bg-card">
                    <CommandInput placeholder="Buscar tema..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontró ningún tema.</CommandEmpty>
                      <CommandGroup>
                        {customThemes
                          .filter((t) => t.mode === key)
                          .map((t) => (
                            <CommandItem
                              key={t.id}
                              value={t.name}
                              onSelect={() => {
                                setModeThemeAssignment(key, t.id)
                                setOpen(false)
                              }}
                              className="cursor-pointer"
                            >
                              <Check className={cn("mr-2 h-4 w-4", modeThemeAssignment[key] === t.id ? "opacity-100" : "opacity-0")} />
                              {t.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Temas Existentes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Temas Existentes</CardTitle>
              <CardDescription>Edita o elimina los temas personalizados</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar temas..."
                value={themeSearchTerm}
                onChange={(e) => setThemeSearchTerm(e.target.value)}
                className="pl-9 bg-input border-border text-foreground w-full sm:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredThemes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg border-border">
              No se encontraron temas que coincidan con "{themeSearchTerm}"
            </div>
          ) : (
            filteredThemes.map((theme) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border transition-all cursor-pointer hover:border-primary/50"
                onMouseEnter={() =>
                  onPreviewChange({
                    name: theme.name,
                    colors: {
                      primary: theme.colors.primary,
                      accent: theme.colors.accent,
                      background: theme.colors.background,
                      foreground: theme.colors.foreground,
                    },
                    font: theme.font || "Geist",
                  })
                }
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {Object.values(theme.colors).map((color, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{theme.name}</p>
                    <div className="flex gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{theme.font}</p>
                      {theme.mode && (
                        <p className="text-xs text-foreground/70 font-semibold">
                          {theme.mode === "light" && "• Claro"}
                          {theme.mode === "dark" && "• Oscuro"}
                          {theme.mode === "colorblind" && "• Daltónico"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingThemeId !== theme.id && (
                    <Button size="sm" variant="outline" onClick={() => startEditing(theme)} className="border-border text-foreground hover:bg-muted">
                      Editar
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => applyTheme(theme)} className="border-border text-foreground hover:bg-muted">
                    Aplicar
                  </Button>
                  {!theme.id.startsWith("default-") && !Object.values(modeThemeAssignment).includes(theme.id as string) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.")) {
                          removeCustomTheme(theme.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {!theme.id.startsWith("default-") && Object.values(modeThemeAssignment).includes(theme.id as string) && (
                    <Button size="sm" variant="secondary" disabled title="No se puede eliminar porque está asignado a un modo">
                      <Trash2 className="h-4 w-4 opacity-50" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

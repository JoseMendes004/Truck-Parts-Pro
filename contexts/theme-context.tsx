"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type ThemeMode = "light" | "dark" | "colorblind"

interface CustomTheme {
  id: string
  name: string
  colors: {
    primary: string
    accent: string
    background: string
    foreground: string
  }
  typography?: {
    headingFont: string
    headingSize: string
    bodyFont: string
    bodySize: string
  }
  font?: string // For backwards compatibility
  mode?: "light" | "dark" | "colorblind"
  isDefault?: boolean
}

interface CustomFont {
  id: string
  name: string
  fontFamily: string
  dataUrl: string
}

interface ModeThemeAssignment {
  light: string
  dark: string
  colorblind: string
}

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  customThemes: CustomTheme[]
  addCustomTheme: (theme: CustomTheme) => void
  removeCustomTheme: (id: string) => void
  updateCustomTheme: (id: string, theme: Partial<CustomTheme>) => void
  applyCustomTheme: (theme: CustomTheme) => void
  applyTheme: (theme: CustomTheme) => void
  globalTypography: {
    headingFont: string
    headingSize: string
    bodyFont: string
    bodySize: string
  }
  setGlobalTypography: (typography: {
    headingFont: string
    headingSize: string
    bodyFont: string
    bodySize: string
  }) => void
  customFonts: CustomFont[]
  addCustomFont: (font: CustomFont) => void
  removeCustomFont: (id: string) => void
  modeThemeAssignment: ModeThemeAssignment
  setModeThemeAssignment: (mode: ThemeMode, themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const defaultLightTheme: CustomTheme = {
  id: "default-light",
  name: "Modo Claro",
  colors: {
    primary: "#f1f5f9", // Used to be secondary
    accent: "#3b82f6",
    background: "#f8fafc",
    foreground: "#0f172a",
  },
  typography: {
    headingFont: "Geist",
    headingSize: "1",
    bodyFont: "Geist",
    bodySize: "1",
  },
  font: "Geist",
  mode: "light",
  isDefault: true,
}

const defaultDarkTheme: CustomTheme = {
  id: "default-dark",
  name: "Modo Oscuro",
  colors: {
    primary: "#1e293b", // Used to be secondary
    accent: "#3b82f6",
    background: "#020617",
    foreground: "#f8fafc",
  },
  typography: {
    headingFont: "Geist",
    headingSize: "1",
    bodyFont: "Geist",
    bodySize: "1",
  },
  font: "Geist",
  mode: "dark",
  isDefault: true,
}

const defaultColorblindTheme: CustomTheme = {
  id: "default-colorblind",
  name: "Modo Daltónico",
  colors: {
    primary: "#f8fafc", // Used to be secondary
    accent: "#eab308",
    background: "#ffffff",
    foreground: "#000000",
  },
  typography: {
    headingFont: "Geist",
    headingSize: "1",
    bodyFont: "Geist",
    bodySize: "1",
  },
  font: "Geist",
  mode: "colorblind",
  isDefault: true,
}

const defaultThemes: CustomTheme[] = [defaultLightTheme, defaultDarkTheme, defaultColorblindTheme]

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark")
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([])
  const [globalTypography, setGlobalTypographyState] = useState({
    headingFont: "Geist",
    headingSize: "1",
    bodyFont: "Geist",
    bodySize: "1",
  })
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([])
  const [mounted, setMounted] = useState(false)
  const [modeThemeAssignment, setModeThemeAssignmentState] = useState<ModeThemeAssignment>({
    light: "default-light",
    dark: "default-dark",
    colorblind: "default-colorblind",
  })

  // Load custom fonts into the document
  const loadCustomFont = (font: CustomFont) => {
    const existingStyle = document.getElementById(`custom-font-${font.id}`)
    if (existingStyle) return

    const style = document.createElement("style")
    style.id = `custom-font-${font.id}`
    style.textContent = `
      @font-face {
        font-family: '${font.fontFamily}';
        src: url('${font.dataUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("truck-parts-theme") as ThemeMode
    const savedTypography = localStorage.getItem("truck-parts-typography")
    const savedCustomThemes = localStorage.getItem("truck-parts-custom-themes")
    const savedCustomFonts = localStorage.getItem("truck-parts-custom-fonts")

    if (savedTheme) {
      setThemeState(savedTheme)
    }
    if (savedTypography) {
      try {
        setGlobalTypographyState(JSON.parse(savedTypography))
      } catch {
        // ignore
      }
    }
    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes)
        // Migration: ensure secondary is merged into primary if it exists
        const migrated = parsed.map((t: any) => {
          if (t.colors && t.colors.secondary && !t.migrated) {
            return {
              ...t,
              colors: {
                ...t.colors,
                primary: t.colors.secondary,
                secondary: undefined
              },
              migrated: true
            }
          }
          return t
        })
        setCustomThemes([defaultLightTheme, defaultDarkTheme, defaultColorblindTheme, ...migrated.filter((t: any) => !t.isDefault)])
      } catch {
        // Ignore parse errors
        setCustomThemes([defaultLightTheme, defaultDarkTheme, defaultColorblindTheme])
      }
    } else {
      setCustomThemes([defaultLightTheme, defaultDarkTheme, defaultColorblindTheme])
    }
    if (savedCustomFonts) {
      try {
        const fonts = JSON.parse(savedCustomFonts) as CustomFont[]
        setCustomFonts(fonts)
        fonts.forEach(loadCustomFont)
      } catch {
        // Ignore parse errors
      }
    }

    const savedModeAssignment = localStorage.getItem("truck-parts-mode-assignment")
    if (savedModeAssignment) {
      try {
        setModeThemeAssignmentState(JSON.parse(savedModeAssignment))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove("light", "dark", "colorblind")
    root.classList.add(theme)
    localStorage.setItem("truck-parts-theme", theme)

    // Aplicar el tema asignado al modo actual
    const themeIdForMode = modeThemeAssignment[theme]
    const themeToApply = customThemes.find(t => t.id === themeIdForMode)
    if (themeToApply) {
      applyCustomTheme(themeToApply)
    }
  }, [theme, mounted, modeThemeAssignment, customThemes])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("truck-parts-typography", JSON.stringify(globalTypography))
    const root = document.documentElement
    root.style.setProperty("--font-heading", globalTypography.headingFont)
    root.style.setProperty("--font-body", globalTypography.bodyFont)
    root.style.setProperty("--heading-size-mult", globalTypography.headingSize)
    root.style.setProperty("--body-size-mult", globalTypography.bodySize)
  }, [globalTypography, mounted])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    // Aplicar el tema asignado al modo seleccionado
    const themeIdForMode = modeThemeAssignment[newTheme]
    const themeToApply = customThemes.find(t => t.id === themeIdForMode)
    if (themeToApply) {
      applyCustomTheme(themeToApply)
    }
  }

  const setGlobalTypography = (typography: {
    headingFont: string
    headingSize: string
    bodyFont: string
    bodySize: string
  }) => {
    setGlobalTypographyState(typography)
  }

  const addCustomTheme = (newTheme: CustomTheme) => {
    const updatedThemes = [...customThemes, newTheme]
    setCustomThemes(updatedThemes)
    const customOnly = updatedThemes.filter(
      (t) => !t.id.startsWith("default-")
    )
    localStorage.setItem("truck-parts-custom-themes", JSON.stringify(customOnly))
  }

  const removeCustomTheme = (id: string) => {
    const updatedThemes = customThemes.filter((t) => t.id !== id)
    setCustomThemes(updatedThemes)
    const customOnly = updatedThemes.filter(
      (t) => !t.id.startsWith("default-")
    )
    localStorage.setItem("truck-parts-custom-themes", JSON.stringify(customOnly))
  }

  const updateCustomTheme = (id: string, updates: Partial<CustomTheme>) => {
    const updatedThemes = customThemes.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    setCustomThemes(updatedThemes)
    const customOnly = updatedThemes.filter(
      (t) => !t.id.startsWith("default-")
    )
    localStorage.setItem("truck-parts-custom-themes", JSON.stringify(customOnly))
  }

  const applyCustomTheme = (customTheme: CustomTheme) => {
    const root = document.documentElement
    const mainColor = customTheme.colors.primary
    const accent = customTheme.colors.accent
    const background = customTheme.colors.background
    const foreground = customTheme.colors.foreground

    if (!mainColor || !accent || !background || !foreground) return

    root.style.setProperty("--primary", mainColor)
    root.style.setProperty("--secondary", mainColor) // Unificado
    root.style.setProperty("--accent", accent)
    root.style.setProperty("--background", background)
    root.style.setProperty("--foreground", foreground)

    // Set derived variables so components look consistent
    root.style.setProperty("--card", background)
    root.style.setProperty("--card-foreground", foreground)
    root.style.setProperty("--popover", background)
    root.style.setProperty("--popover-foreground", foreground)
    root.style.setProperty("--primary-foreground", background)
    root.style.setProperty("--secondary-foreground", foreground)
    root.style.setProperty("--accent-foreground", background)
    root.style.setProperty("--muted", mainColor) // Unificado
    root.style.setProperty("--muted-foreground", foreground)
    root.style.setProperty("--border", mainColor) // Unificado
    root.style.setProperty("--input", mainColor) // Unificado

    // Sidebar variables to match the theme
    root.style.setProperty("--sidebar", background) // Match sidebar with global background
    root.style.setProperty("--sidebar-foreground", foreground)
    root.style.setProperty("--sidebar-primary", accent)
    root.style.setProperty("--sidebar-primary-foreground", background)
    root.style.setProperty("--sidebar-accent", accent)
    root.style.setProperty("--sidebar-accent-foreground", background)
    root.style.setProperty("--sidebar-border", accent)
    root.style.setProperty("--sidebar-ring", accent)
  }

  const applyTheme = (theme: CustomTheme) => {
    applyCustomTheme(theme)
    if (theme.mode) {
      setThemeState(theme.mode)
    }
  }

  const addCustomFont = (font: CustomFont) => {
    loadCustomFont(font)
    const updatedFonts = [...customFonts, font]
    setCustomFonts(updatedFonts)
    localStorage.setItem("truck-parts-custom-fonts", JSON.stringify(updatedFonts))
  }

  const removeCustomFont = (id: string) => {
    const fontToRemove = customFonts.find(f => f.id === id)
    if (fontToRemove) {
      if (globalTypography.headingFont === fontToRemove.fontFamily) {
        setGlobalTypographyState(prev => ({ ...prev, headingFont: "Geist" }))
      }
      if (globalTypography.bodyFont === fontToRemove.fontFamily) {
        setGlobalTypographyState(prev => ({ ...prev, bodyFont: "Geist" }))
      }
    }
    const existingStyle = document.getElementById(`custom-font-${id}`)
    if (existingStyle) {
      existingStyle.remove()
    }
    const updatedFonts = customFonts.filter(f => f.id !== id)
    setCustomFonts(updatedFonts)
    localStorage.setItem("truck-parts-custom-fonts", JSON.stringify(updatedFonts))
  }

  const setModeThemeAssignment = (mode: ThemeMode, themeId: string) => {
    const updated = { ...modeThemeAssignment, [mode]: themeId }
    setModeThemeAssignmentState(updated)
    localStorage.setItem("truck-parts-mode-assignment", JSON.stringify(updated))
    
    if (theme === mode) {
      const selectedTheme = customThemes.find(t => t.id === themeId)
      if (selectedTheme) {
        applyCustomTheme(selectedTheme)
      }
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        customThemes,
        addCustomTheme,
        removeCustomTheme,
        updateCustomTheme,
        applyCustomTheme,
        applyTheme,
        globalTypography,
        setGlobalTypography,
        customFonts,
        addCustomFont,
        removeCustomFont,
        modeThemeAssignment,
        setModeThemeAssignment,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}


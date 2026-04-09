"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

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

interface PreviewPanelProps {
  previewTheme: PreviewTheme | null
  previewTypography: {
    headingFont: string
    bodyFont: string
    headingSize: string | number
    bodySize: string | number
  }
}

export function PreviewPanel({ previewTheme, previewTypography }: PreviewPanelProps) {
  return (
    <div className="lg:sticky lg:top-0 h-fit">
      <Card className="bg-card border-border overflow-hidden shadow-xl">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Previsualización en Vivo
          </CardTitle>
          <CardDescription>Así se verá la aplicación con los cambios</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div
            id="preview-container-root"
            className="min-h-[600px] flex flex-col relative overflow-hidden"
            style={{
              backgroundColor: previewTheme?.colors.background || "#fafafa",
              color: previewTheme?.colors.foreground || "#1a1a1a",
              fontFamily: `'${previewTypography.bodyFont}', sans-serif`,
            }}
          >
            <style dangerouslySetInnerHTML={{ __html: `
              #preview-container-root .font-heading,
              #preview-container-root h1,
              #preview-container-root h2,
              #preview-container-root h3 {
                font-family: '${previewTypography.headingFont}', sans-serif !important;
                font-size: calc(24px * ${previewTypography.headingSize}) !important;
                line-height: 1.2;
              }
              #preview-container-root .subtitle,
              #preview-container-root p,
              #preview-container-root li,
              #preview-container-root button {
                font-family: '${previewTypography.bodyFont}', sans-serif;
                font-size: calc(14px * ${previewTypography.bodySize}) !important;
              }
            ` }} />

            {/* Header de previsualización */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{
                backgroundColor: previewTheme?.colors.primary || "#dc4a1a",
                borderColor: `${previewTheme?.colors.foreground || "#1a1a1a"}20`,
              }}
            >
              <span className="font-bold font-heading" style={{ color: previewTheme?.colors.background || "#ffffff" }}>
                TruckPartsPro
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                <div className="w-2 h-2 rounded-full bg-current opacity-50" />
              </div>
            </div>

            <div className="flex-1 p-4">
              {/* Tarjetas de producto */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: `${previewTheme?.colors.primary || "#dc4a1a"}80`,
                      borderColor: previewTheme?.colors.accent || "#dc4a1a",
                      boxShadow: `0 0 12px 3px ${(previewTheme?.colors.accent || "#dc4a1a")}66`,
                    }}
                  >
                    <div
                      className="w-full aspect-square rounded mb-2 flex items-center justify-center"
                      style={{ backgroundColor: previewTheme?.colors.background || "#fafafa" }}
                    >
                      <span className="text-2xl opacity-30">📦</span>
                    </div>
                    <h4 className="subtitle font-medium mb-1">Subtítulo Producto {i}</h4>
                    <p className="font-bold" style={{ color: previewTheme?.colors.foreground || "#dc4a1a" }}>
                      $199.99
                    </p>
                  </div>
                ))}
              </div>

              {/* Botón */}
              <button
                className="w-full py-3 rounded-lg font-semibold mb-6"
                style={{
                  backgroundColor: previewTheme?.colors.accent || "#dc4a1a",
                  color: previewTheme?.colors.background || "#ffffff",
                  boxShadow: `0 0 18px 6px ${(previewTheme?.colors.accent || "#dc4a1a")}66`,
                }}
              >
                Ver Detalles
              </button>

              {/* Footer */}
              <div
                className="p-6 rounded-lg grid grid-cols-2 gap-4"
                style={{
                  backgroundColor: previewTheme?.colors.primary || "#dc4a1a",
                  color: previewTheme?.colors.foreground || "#ffffff",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-2 opacity-60 font-heading">Enlaces</h4>
                    <ul className="space-y-1 opacity-90 subtitle" style={{ fontSize: "10px" }}>
                      <li>Inicio</li>
                      <li>Productos</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-2 opacity-60 font-heading">Categorías</h4>
                  <ul className="space-y-1 opacity-90 subtitle" style={{ fontSize: "10px" }}>
                    <li>Motores</li>
                    <li>Frenos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

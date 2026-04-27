"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Printer, FileText, Building2, Receipt, Stamp, Save } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

const DEFAULT_INVOICE = {
  compName: "TRUCKSPARTS, C.A.",
  compRif: "J-40823910-0",
  compAddress: "Calle Los Laboratorios, Edif. Industrial Center, PB, Los Ruices, Caracas, Edo. Miranda. CP 1071.",
  compPhone: "(0212) 235-9988",
  compEmail: "ventas@trucksparts.com.ve",
  compStatus: "CONTRIBUYENTE ESPECIAL",
  controlNo: "00-0004562",
  invoiceNo: "00004562",
  date: "27/03/2026",
  time: "8:56:00 pm",
  printerName: "TRUCKSPARTS INTERNAL PRINTING, S.A.",
  printerRif: "J-40823910-1",
  printerProvidence: "SENIAT/INTI/2026/0122",
  printerDate: "01/03/2026",
  validRange: "00-0005001 hasta 00-0006000",
  validIssue: "01/03/2026",
  validUntil: "01/03/2027",
}

type SectionKey = "empresa" | "factura" | "imprenta"

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "empresa",  label: "Empresa",  icon: Building2 },
  { key: "factura",  label: "Factura",  icon: Receipt },
  { key: "imprenta", label: "Imprenta", icon: Stamp },
]

export function AdminFactura() {
  const { invoice: contextInvoice, updateInvoice } = useCart()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState(contextInvoice)
  const [activeSection, setActiveSection] = useState<SectionKey>("empresa")

  const set = useCallback((key: keyof typeof contextInvoice, value: string) => {
    setInvoice((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = () => {
    updateInvoice(invoice)
    toast({
      title: "Factura Guardada",
      description: "Los cambios se han aplicado correctamente al sistema.",
    })
  }

  const handlePrint = () => {
    const printContent = document.getElementById("factura-preview")
    if (!printContent) return
    const w = window.open("", "_blank", "width=900,height=700")
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura ${invoice.invoiceNo}</title>
    <style>
      body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; margin: 0; padding: 20px; }
      .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px; }
      .invoice-meta { width: 38%; text-align: right; border: 2px solid #000; padding: 10px; flex-shrink: 0; }
      .red-text { color: #d00; font-weight: bold; font-size: 14px; }
      .client-box { border: 1px solid #000; padding: 10px; margin-bottom: 15px; display: grid; grid-template-columns: 2fr 1fr; line-height: 1.6; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
      th { border: 1px solid #000; background: #eee; padding: 6px; text-align: left; }
      td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 6px; }
      .row-end td { border-bottom: 1px solid #000; }
      .totals-wrap { display: flex; justify-content: flex-end; }
      .totals-table { width: 45%; border: 1px solid #000; border-collapse: collapse; }
      .totals-table td { padding: 4px 8px; text-align: right; border: 1px solid #eee; }
      .imprenta-footer { margin-top: 30px; font-size: 10px; border: 1px dashed #000; padding: 8px; display: grid; grid-template-columns: 1fr 1fr; }
    </style></head><body>${printContent.innerHTML}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  return (
    <div className="flex gap-6 items-start">

      {/* ========== FORMULARIO EN TABS ========== */}
      <Card className="bg-card border-border w-[420px] shrink-0">
        {/* Tab bar */}
        <div className="flex border-b border-border overflow-x-auto">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeSection === key
                  ? "border-accent text-accent bg-accent/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <CardContent className="pt-5 pb-5">

          {/* --- EMPRESA --- */}
          {activeSection === "empresa" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nombre de la Empresa</Label>
                <Input value={invoice.compName} onChange={(e) => set("compName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">RIF</Label>
                <Input value={invoice.compRif} onChange={(e) => set("compRif", e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Domicilio Fiscal</Label>
                <Textarea rows={2} value={invoice.compAddress} onChange={(e) => set("compAddress", e.target.value)} className="resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Teléfono</Label>
                <Input value={invoice.compPhone} onChange={(e) => set("compPhone", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input value={invoice.compEmail} onChange={(e) => set("compEmail", e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Condición Tributaria</Label>
                <Input value={invoice.compStatus} onChange={(e) => set("compStatus", e.target.value)} />
              </div>
            </div>
          )}

          {/* --- FACTURA --- */}
          {activeSection === "factura" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">N° de Control</Label>
                <Input value={invoice.controlNo} onChange={(e) => set("controlNo", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">N° de Factura</Label>
                <Input value={invoice.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fecha</Label>
                <Input value={invoice.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Hora</Label>
                <Input value={invoice.time} onChange={(e) => set("time", e.target.value)} />
              </div>
            </div>
          )}


          {/* --- IMPRENTA --- */}
          {activeSection === "imprenta" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nombre Imprenta</Label>
                <Input value={invoice.printerName} onChange={(e) => set("printerName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">RIF Imprenta</Label>
                <Input value={invoice.printerRif} onChange={(e) => set("printerRif", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">N° Providencia</Label>
                <Input value={invoice.printerProvidence} onChange={(e) => set("printerProvidence", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fecha de Impresión</Label>
                <Input value={invoice.printerDate} onChange={(e) => set("printerDate", e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Rango de Vigencia</Label>
                <Input value={invoice.validRange} onChange={(e) => set("validRange", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fecha Emisión Talonario</Label>
                <Input value={invoice.validIssue} onChange={(e) => set("validIssue", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Válido Hasta</Label>
                <Input value={invoice.validUntil} onChange={(e) => set("validUntil", e.target.value)} />
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-border pt-4">
            <Button className="w-full gap-2 font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }} onClick={handleSave}>
              <Save className="h-4 w-4" /> Guardar Cambios
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* ========== VISTA PREVIA ========== */}
      <Card className="bg-card border-border overflow-hidden shadow-xl flex-1 min-w-0">
        <CardHeader className="border-b border-border bg-muted/30 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Vista Previa de Factura
          </CardTitle>
          <Button size="sm" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Imprimir / Exportar
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div
            id="factura-preview"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "11px",
              color: "#000",
              backgroundColor: "white",
              padding: "1.2cm",
              minWidth: "700px",
            }}
          >
            {/* Encabezado empresa + meta */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", borderBottom: "2px solid #000", paddingBottom: "10px", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: "0 0 4px 0", fontSize: "17px", fontFamily: "'Courier New', monospace" }}>{invoice.compName}</h1>
                <div style={{ lineHeight: 1.55 }}>
                  <strong>RIF: {invoice.compRif}</strong><br />
                  <strong>Domicilio Fiscal:</strong> {invoice.compAddress}<br />
                  Teléfono: {invoice.compPhone} | Email: {invoice.compEmail}<br />
                  <em>{invoice.compStatus}</em>
                </div>
              </div>
              <div style={{ width: "36%", textAlign: "right", border: "2px solid #000", padding: "10px", flexShrink: 0, lineHeight: 1.7 }}>
                <strong style={{ fontSize: "13px" }}>FACTURA</strong><br />
                N° DE CONTROL: <span style={{ color: "#c00", fontWeight: "bold", fontSize: "13px" }}>{invoice.controlNo}</span><br />
                N° DE FACTURA: <span style={{ color: "#c00", fontWeight: "bold", fontSize: "13px" }}>{invoice.invoiceNo}</span><br />
                <strong>FECHA:</strong> {invoice.date}<br />
                <strong>HORA:</strong> {invoice.time}
              </div>
            </div>

            {/* Datos del cliente — espacio en blanco para llenar a mano */}
            <div style={{ border: "1px solid #000", padding: "8px 12px", marginBottom: "14px", display: "grid", gridTemplateColumns: "2fr 1fr", lineHeight: 2.1, minHeight: "80px" }}>
              <div>
                <strong>RAZÓN SOCIAL:</strong> ___________________________________<br />
                <strong>RIF:</strong> ___________________<br />
                <strong>DIRECCIÓN:</strong> _____________________________________________
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>CONDICIÓN:</strong> _______________<br />
                <strong>ORDEN DE COMPRA:</strong> ________
              </div>
            </div>

            {/* Tabla productos — filas en blanco */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "8%", textAlign: "center" }}>CANT.</th>
                  <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "56%", textAlign: "left" }}>DESCRIPCIÓN</th>
                  <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "18%", textAlign: "right" }}>P. UNITARIO</th>
                  <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "18%", textAlign: "right" }}>TOTAL VENTAS</th>
                </tr>
              </thead>
              <tbody>
                {[0,1,2,3,4,5,6,7].map((i) => (
                  <tr key={i} style={i === 7 ? { borderBottom: "1px solid #000" } : {}}>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "8px" }}>&nbsp;</td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "8px" }}>&nbsp;</td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "8px" }}>&nbsp;</td>
                    <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "8px" }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales — valores en blanco */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <table style={{ width: "42%", border: "1px solid #000", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>SUB-TOTAL:</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>DESCUENTO CUPÓN:</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>&nbsp;</td>
                  </tr>
                  <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>BASE IMPONIBLE (ALÍCUOTA 16%):</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>I.V.A. (16%):</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>&nbsp;</td>
                  </tr>
                  <tr style={{ fontWeight: "bold", borderTop: "2px solid #000", fontSize: "12px" }}>
                    <td style={{ padding: "6px 8px" }}>TOTAL GENERAL:</td>
                    <td style={{ padding: "6px 8px", textAlign: "right" }}>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Imprenta */}
            <div style={{ fontSize: "9.5px", border: "1px dashed #555", padding: "8px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", lineHeight: 1.6 }}>
              <div>
                <strong>DATOS DE LA IMPRENTA (Art. 7 Num. 14):</strong><br />
                Nombre: {invoice.printerName}<br />
                RIF: {invoice.printerRif}<br />
                N° Providencia: {invoice.printerProvidence}<br />
                Fecha de Impresión: {invoice.printerDate}
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>VIGENCIA (Art. 7 Num. 15):</strong><br />
                Desde el N° {invoice.validRange}<br />
                Fecha de Emisión del Talonario: {invoice.validIssue}<br />
                <strong>Válido hasta: {invoice.validUntil}</strong>
              </div>
            </div>

            {/* Aviso legal */}
            <p style={{ marginTop: "10px", fontSize: "9px", textAlign: "center", color: "#444" }}>
              "ESTA FACTURA CONSTITUYE TÍTULO EJECUTIVO DE ACUERDO AL ART. 634 DEL CÓDIGO DE COMERCIO VENEZOLANO"
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

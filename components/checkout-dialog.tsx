"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react"

interface ClientData {
  razonSocial: string
  rif: string
  direccion: string
  condicion: string
}

type Step = "form" | "invoice"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function fmt(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2 })
}

function generateOrderNumber() {
  return `#${Math.floor(10000 + Math.random() * 90000)}`
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, total, clear } = useCart()
  const [step, setStep] = useState<Step>("form")
  const [ordenCompra] = useState(() => generateOrderNumber())
  const [client, setClient] = useState<ClientData>({
    razonSocial: "",
    rif: "",
    direccion: "",
    condicion: "CONTADO",
  })

  const set = (key: keyof ClientData, value: string) =>
    setClient((prev) => ({ ...prev, [key]: value }))

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const iva = subtotal * 0.16
  const totalFinal = subtotal + iva

  // Invoice numbers — static for demo
  const controlNo = "00-0004563"
  const invoiceNo = "00004563"
  const today = new Date().toLocaleDateString("es-VE")
  const time = new Date().toLocaleTimeString("es-VE")

  const handlePrint = () => {
    const el = document.getElementById("checkout-invoice-preview")
    if (!el) return
    const w = window.open("", "_blank", "width=900,height=700")
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura ${invoiceNo}</title>
    <style>
      body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; margin: 0; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
      th { border: 1px solid #000; background: #e8e8e8; padding: 6px 8px; text-align: left; }
      td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 6px 8px; }
      .row-end td { border-bottom: 1px solid #000; }
    </style></head><body>${el.innerHTML}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  const handleClose = () => {
    onOpenChange(false)
    // reset after close animation
    setTimeout(() => setStep("form"), 300)
  }

  const handlePay = () => {
    if (!client.razonSocial || !client.rif) return
    setStep("invoice")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-background border-border">

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground text-lg">Datos para la Factura</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label className="text-xs text-muted-foreground">Razón Social *</Label>
                <Input value={client.razonSocial} onChange={(e) => set("razonSocial", e.target.value)} placeholder="EMPRESA, C.A." />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label className="text-xs text-muted-foreground">RIF *</Label>
                <Input value={client.rif} onChange={(e) => set("rif", e.target.value)} placeholder="J-00000000-0" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-muted-foreground">Dirección</Label>
                <Textarea rows={2} value={client.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Av. ..." className="resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Condición de Pago</Label>
                <Input value={client.condicion} onChange={(e) => set("condicion", e.target.value)} placeholder="CONTADO / CRÉDITO" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Orden de Compra</Label>
                <Input value={ordenCompra} readOnly className="bg-muted/40 text-muted-foreground cursor-not-allowed select-none" />
              </div>
            </div>

            {/* Order summary */}
            <div className="border border-border rounded-xl p-4 space-y-2 bg-muted/10">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Resumen del Pedido</p>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.qty}x {item.name}</span>
                  <span className="text-foreground font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>${fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>I.V.A. (16%)</span><span>${fmt(iva)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground">
                  <span>Total</span><span style={{ color: "var(--accent)" }}>${fmt(totalFinal)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-11 font-semibold mt-2"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
              disabled={!client.razonSocial || !client.rif}
              onClick={handlePay}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Pagar y Generar Factura
            </Button>
          </>
        )}

        {step === "invoice" && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => setStep("form")}>
                  <ArrowLeft className="h-4 w-4" /> Volver
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-2" style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }} onClick={handlePrint}>
                    <Printer className="h-4 w-4" /> Imprimir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { clear(); handleClose() }}>
                    Finalizar
                  </Button>
                </div>
              </div>
              <DialogTitle className="text-foreground text-base mt-2">Factura Generada</DialogTitle>
            </DialogHeader>

            {/* Invoice preview */}
            <div
              id="checkout-invoice-preview"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "11px",
                color: "#000",
                backgroundColor: "white",
                padding: "1cm",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "2px solid #000", paddingBottom: "10px", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>TRUCKSPARTS, C.A.</h1>
                  <div style={{ lineHeight: 1.55 }}>
                    <strong>RIF: J-40823910-0</strong><br />
                    <strong>Domicilio Fiscal:</strong> Calle Los Laboratorios, Edif. Industrial Center, PB, Los Ruices, Caracas.<br />
                    Tel: (0212) 235-9988 | ventas@trucksparts.com.ve<br />
                    <em>CONTRIBUYENTE ESPECIAL</em>
                  </div>
                </div>
                <div style={{ width: "36%", textAlign: "right", border: "2px solid #000", padding: "10px", flexShrink: 0, lineHeight: 1.7 }}>
                  <strong style={{ fontSize: "13px" }}>FACTURA</strong><br />
                  N° DE CONTROL: <span style={{ color: "#c00", fontWeight: "bold" }}>{controlNo}</span><br />
                  N° DE FACTURA: <span style={{ color: "#c00", fontWeight: "bold" }}>{invoiceNo}</span><br />
                  <strong>FECHA:</strong> {today}<br />
                  <strong>HORA:</strong> {time}
                </div>
              </div>

              {/* Client */}
              <div style={{ border: "1px solid #000", padding: "8px 12px", marginBottom: "14px", display: "grid", gridTemplateColumns: "2fr 1fr", lineHeight: 1.65 }}>
                <div>
                  <strong>RAZÓN SOCIAL:</strong> {client.razonSocial}<br />
                  <strong>RIF:</strong> {client.rif}<br />
                  <strong>DIRECCIÓN:</strong> {client.direccion || "—"}
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>CONDICIÓN:</strong> {client.condicion}<br />
                  <strong>ORDEN DE COMPRA:</strong> {ordenCompra}
                </div>
              </div>

              {/* Products table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "8%", textAlign: "center" }}>CANT.</th>
                    <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "56%" }}>DESCRIPCIÓN</th>
                    <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "18%", textAlign: "right" }}>P. UNITARIO</th>
                    <th style={{ border: "1px solid #000", background: "#e8e8e8", padding: "6px 8px", width: "18%", textAlign: "right" }}>TOTAL VENTAS</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id} style={i === items.length - 1 ? { borderBottom: "1px solid #000" } : {}}>
                      <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "6px 8px", textAlign: "center" }}>{String(item.qty).padStart(2, "0")}</td>
                      <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "6px 8px" }}>{item.name}</td>
                      <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "6px 8px", textAlign: "right" }}>{fmt(item.price)}</td>
                      <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "6px 8px", textAlign: "right" }}>{fmt(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <table style={{ width: "42%", border: "1px solid #000", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>SUB-TOTAL:</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>{fmt(subtotal)}</td>
                    </tr>
                    <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>BASE IMPONIBLE (16%):</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>{fmt(subtotal)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>I.V.A. (16%):</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>{fmt(iva)}</td>
                    </tr>
                    <tr style={{ fontWeight: "bold", borderTop: "2px solid #000", fontSize: "12px" }}>
                      <td style={{ padding: "6px 8px" }}>TOTAL GENERAL:</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(totalFinal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Imprenta footer */}
              <div style={{ fontSize: "9.5px", border: "1px dashed #555", padding: "8px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", lineHeight: 1.6 }}>
                <div>
                  <strong>DATOS DE LA IMPRENTA (Art. 7 Num. 14):</strong><br />
                  Nombre: TRUCKSPARTS INTERNAL PRINTING, S.A.<br />
                  RIF: J-40823910-1 | N° Providencia: SENIAT/INTI/2026/0122
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>VIGENCIA (Art. 7 Num. 15):</strong><br />
                  Desde el N° 00-0005001 hasta 00-0006000<br />
                  <strong>Válido hasta: 01/03/2027</strong>
                </div>
              </div>

              <p style={{ marginTop: "10px", fontSize: "9px", textAlign: "center", color: "#444" }}>
                "ESTA FACTURA CONSTITUYE TÍTULO EJECUTIVO DE ACUERDO AL ART. 634 DEL CÓDIGO DE COMERCIO VENEZOLANO"
              </p>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}

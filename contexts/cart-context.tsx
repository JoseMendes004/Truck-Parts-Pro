"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  qty: number
}

export interface InvoiceData {
  compName: string
  compRif: string
  compAddress: string
  compPhone: string
  compEmail: string
  compStatus: string
  controlNo: string
  invoiceNo: string
  date: string
  time: string
  printerName: string
  printerRif: string
  printerProvidence: string
  printerDate: string
  validRange: string
  validIssue: string
  validUntil: string
}

const DEFAULT_INVOICE: InvoiceData = {
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

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Omit<CartItem, "qty">) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clear: () => void
  total: number
  count: number
  invoice: InvoiceData
  updateInvoice: (data: InvoiceData) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE)

  const addItem = useCallback((product: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i))
    }
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const updateInvoice = useCallback((data: InvoiceData) => {
    setInvoice(data)
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count, invoice, updateInvoice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

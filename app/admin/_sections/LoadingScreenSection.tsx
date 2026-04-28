"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useLoading } from "@/contexts/loading-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MonitorPlay, CheckCircle2, XCircle } from "lucide-react"

// ── Inline Three.js config (mirrors loading-screen.tsx) ──────────────────────

const CONFIG = {
  WORLD_SIZE: 10,
  EXTRUDE_DEPTH: 1.0,
  HOLD_MS: 800,
  TRANS_MS: 1500,
}

const RAW_FIGURES = [
  {
    label: "8",
    vb: [60, 90, 400, 260],
    pieces: [
      [[210,100],[350,100],[350,240]],
      [[350,100],[450,200],[350,300]],
      [[210,100],[210,200],[310,200]],
      [[70,170],[140,100],[140,170]],
      [[315,335],[385,335],[385,265]],
      [[140,100],[210,100],[210,170],[140,170]],
      [[140,270],[210,200],[280,200],[210,270]]
    ]
  },
  {
    label: "82",
    vb: [-35, -35, 250, 250],
    pieces: [
      [[0,0],[120,0],[120,120]],
      [[0,0],[0,120],[120,120]],
      [[120,120],[180,60],[180,180]],
      [[60,120],[120,180],[60,180]],
      [[120,0],[180,0],[180,60]],
      [[0,120],[60,120],[60,180],[0,180]],
      [[60,120],[120,120],[180,180],[120,180]]
    ]
  },
  {
    label: "163",
    vb: [170, -10, 160, 355],
    pieces: [
      [[179,220],[321,220],[250,291]],
      [[250,150],[179,220],[321,220]],
      [[200,150],[300,150],[300,50]],
      [[200,50],[200,150],[250,100]],
      [[285,299],[320,334],[250,334]],
      [[250,0],[200,50],[250,100],[300,50]],
      [[215,299],[285,299],[250,334],[180,334]]
    ]
  }
]

const normalize = (fig: any) => {
  const [vx, vy, vw, vh] = fig.vb
  const scale = CONFIG.WORLD_SIZE / Math.max(vw, vh)
  return fig.pieces.map((pts: any) =>
    pts.map(([x, y]: [number, number]) => [
      (x - vx - vw / 2) * scale,
      -(y - vy - vh / 2) * scale,
    ])
  )
}

const decompose = (pts: any) => {
  const centroid = [0, 0]
  pts.forEach((p: any) => { centroid[0] += p[0]; centroid[1] += p[1] })
  centroid[0] /= pts.length
  centroid[1] /= pts.length
  const local = pts.map((p: any) => [p[0] - centroid[0], p[1] - centroid[1]])
  const angle = Math.atan2(local[1][1] - local[0][1], local[1][0] - local[0][0])
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const base = local.map((p: any) => [p[0] * cos - p[1] * sin, p[0] * sin + p[1] * cos])
  return { centroid, angle, base }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpAngle = (a: number, b: number, t: number) => {
  const diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI
  return a + (diff < -Math.PI ? diff + Math.PI * 2 : diff) * t
}
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// ── Preview miniature component ───────────────────────────────────────────────

function LoadingScreenPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const W = el.clientWidth
    const H = el.clientHeight

    const resolveColor = (cssVar: string) => {
      const tmp = document.createElement("div")
      tmp.style.color = `var(${cssVar})`
      tmp.style.display = "none"
      document.body.appendChild(tmp)
      const computed = getComputedStyle(tmp).color
      document.body.removeChild(tmp)
      return computed
    }

    const accentRGB = resolveColor("--accent") || "#3b82f6"
    const accentColor = new THREE.Color(accentRGB)
    const hsl = { h: 0, s: 0, l: 0 }
    accentColor.getHSL(hsl)

    const PIECE_COLORS = Array.from({ length: 7 }, () => {
      const c = new THREE.Color()
      c.setHSL(hsl.h, hsl.s, hsl.l)
      return c
    })

    const baseFigures = RAW_FIGURES.map((raw) => ({
      label: raw.label,
      props: normalize(raw).map(decompose),
    }))

    const figures = [
      {
        label: "scattered",
        props: baseFigures[0].props.map((p: any) => ({
          ...p,
          centroid: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
          angle: Math.random() * Math.PI * 4,
        })),
      },
      ...baseFigures,
    ]

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 1000)
    camera.position.set(0, 0, 25)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const spot = new THREE.SpotLight(0xffffff, 2000)
    spot.position.set(15, 20, 25)
    scene.add(spot)
    const fill = new THREE.PointLight(accentColor, 800)
    fill.position.set(-15, -10, 10)
    scene.add(fill)

    const pieces: any[] = []
    const group = new THREE.Group()
    scene.add(group)

    for (let i = 0; i < 7; i++) {
      const pGroup = new THREE.Group()
      const { base } = figures[0].props[i]
      const shape = new THREE.Shape()
      shape.moveTo(base[0][0], base[0][1])
      for (let j = 1; j < base.length; j++) shape.lineTo(base[j][0], base[j][1])
      shape.closePath()
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: CONFIG.EXTRUDE_DEPTH,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3,
      })
      geo.translate(0, 0, -CONFIG.EXTRUDE_DEPTH / 2)
      const mat = new THREE.MeshPhysicalMaterial({
        color: PIECE_COLORS[i],
        roughness: 0.1,
        metalness: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      pGroup.add(mesh)
      group.add(pGroup)
      pieces.push({ group: pGroup, mesh })
    }

    let startTime: number | null = null
    let animId: number

    const animate = (now: number) => {
      if (!startTime) startTime = now
      const phaseMs = CONFIG.HOLD_MS + CONFIG.TRANS_MS
      const cycleMs = phaseMs * figures.length
      const elapsed = (now - startTime) % cycleMs
      const phaseIndex = Math.floor(elapsed / phaseMs)
      const phaseElapsed = elapsed % phaseMs
      const fromFig = figures[phaseIndex]
      const toFig = figures[(phaseIndex + 1) % figures.length]

      let t = 0, jump = 0, extraRot = 0
      if (phaseElapsed > CONFIG.HOLD_MS) {
        const rawT = (phaseElapsed - CONFIG.HOLD_MS) / CONFIG.TRANS_MS
        t = easeInOutCubic(rawT)
        jump = Math.sin(t * Math.PI) * 5.0
        extraRot = Math.sin(t * Math.PI) * 0.6
      }

      pieces.forEach((p, i) => {
        const p1 = fromFig.props[i]
        const p2 = toFig.props[i]
        let expansion = 0
        if (phaseElapsed > CONFIG.HOLD_MS) {
          const rawT = (phaseElapsed - CONFIG.HOLD_MS) / CONFIG.TRANS_MS
          expansion = Math.sin(easeInOutCubic(rawT) * Math.PI) * 1.5
        }
        const cx = lerp(p1.centroid[0], p2.centroid[0], t)
        const cy = lerp(p1.centroid[1], p2.centroid[1], t)
        p.group.position.set(cx * (1 + expansion), cy * (1 + expansion), jump)
        p.group.rotation.set(extraRot, extraRot * 0.5, lerpAngle(p1.angle, p2.angle, t))
        const baseInterp = p1.base.map((pt: any, j: number) => [
          lerp(pt[0], p2.base[j][0], t),
          lerp(pt[1], p2.base[j][1], t),
        ])
        const shape = new THREE.Shape()
        shape.moveTo(baseInterp[0][0], baseInterp[0][1])
        for (let j = 1; j < baseInterp.length; j++) shape.lineTo(baseInterp[j][0], baseInterp[j][1])
        shape.closePath()
        p.mesh.geometry.dispose()
        p.mesh.geometry = new THREE.ExtrudeGeometry(shape, {
          depth: CONFIG.EXTRUDE_DEPTH,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 3,
        })
        p.mesh.geometry.translate(0, 0, -CONFIG.EXTRUDE_DEPTH / 2)
      })

      group.rotation.y = Math.sin(now * 0.0005) * 0.15
      group.rotation.x = 0.2 + Math.cos(now * 0.0004) * 0.1
      group.position.y = 2.0 + Math.sin(now * 0.0006) * 0.8
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "var(--background)" }}
    />
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export function LoadingScreenSection() {
  const { isLoadingScreenEnabled, setLoadingScreenEnabled } = useLoading()

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">

        {/* Encabezado */}
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
          >
            <MonitorPlay className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">Pantalla de Carga</h3>
            <p className="text-xs text-muted-foreground">
              Controla la animación 3D que aparece al navegar o iniciar sesión
            </p>
          </div>
        </div>

        {/* Toggle de activación */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
          <div className="flex items-center gap-3">
            {isLoadingScreenEnabled ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="loading-toggle" className="text-sm font-medium cursor-pointer">
                {isLoadingScreenEnabled ? "Activada" : "Desactivada"}
              </Label>
            </div>
          </div>
          <Switch
            id="loading-toggle"
            checked={isLoadingScreenEnabled}
            onCheckedChange={setLoadingScreenEnabled}
            className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-red-500"
          />
        </div>

        {/* Previsualización */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Previsualización
          </p>
          <div
            className="relative rounded-2xl overflow-hidden border border-border"
            style={{ height: "260px" }}
          >
            {isLoadingScreenEnabled ? (
              <LoadingScreenPreview />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: "var(--background)" }}
              >
                <XCircle className="h-10 w-10 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground opacity-60">
                  Pantalla de carga desactivada
                </p>
              </div>
            )}

            {/* Etiqueta de preview */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-border/50"
              style={{
                background: "color-mix(in srgb, var(--background) 80%, transparent)",
                color: "var(--foreground)",
              }}
            >
              Vista previa en tiempo real
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

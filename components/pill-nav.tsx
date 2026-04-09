"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

export type PillNavItem = {
  label: string
  href: string
  ariaLabel?: string
}

interface PillNavProps {
  items: PillNavItem[]
  activeHref?: string
  ease?: string
  baseColor?: string
  pillColor?: string
  hoveredPillTextColor?: string
  pillTextColor?: string
}

export function PillNav({
  items,
  activeHref,
  ease = 'power3.out',
  baseColor = 'var(--background)',
  pillColor = 'var(--foreground)',
  hoveredPillTextColor = 'var(--background)',
  pillTextColor,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([])
  const navItemsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement as HTMLElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        if (w === 0 || h === 0) return

        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector<HTMLElement>('.pill-label')
        const white = pill.querySelector<HTMLElement>('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.75, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 0.75, ease, overwrite: 'auto' }, 0)
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(white, { y: 0, opacity: 1, duration: 0.75, ease, overwrite: 'auto' }, 0)
        }

        tlRefs.current[i] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {})

    return () => window.removeEventListener('resize', layout)
  }, [items, ease])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.5,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.4,
      ease,
      overwrite: 'auto',
    })
  }

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
    '--nav-h': '38px',
    '--pill-pad-x': '16px',
    '--pill-gap': '3px',
  } as React.CSSProperties

  const basePillClasses =
    'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full font-semibold text-[13px] leading-[0] uppercase tracking-[0.5px] whitespace-nowrap cursor-pointer'

  return (
    <div
      ref={navItemsRef}
      className="relative items-center rounded-full hidden md:flex"
      style={{ ...cssVars, height: 'var(--nav-h)', background: 'var(--base)' }}
    >
      <ul
        role="menubar"
        className="list-none flex items-stretch m-0 p-[3px] h-full"
        style={{ gap: 'var(--pill-gap)' }}
      >
        {items.map((item, i) => {
          const isActive = activeHref === item.href

          const pillStyle: React.CSSProperties = {
            background: isActive ? 'var(--pill-bg)' : 'transparent',
            color: isActive ? 'var(--pill-text)' : 'var(--pill-bg)',
            paddingLeft: 'var(--pill-pad-x)',
            paddingRight: 'var(--pill-pad-x)',
          }

          const PillContent = (
            <>
              <span
                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                style={{ background: 'var(--accent)', willChange: 'transform' }}
                aria-hidden="true"
                ref={el => { circleRefs.current[i] = el }}
              />
              <span className="label-stack relative inline-block leading-[1] z-[2]">
                <span
                  className="pill-label relative z-[2] inline-block leading-[1]"
                  style={{ willChange: 'transform', color: isActive ? 'var(--pill-text)' : 'var(--pill-bg)' }}
                >
                  {item.label}
                </span>
                <span
                  className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                  style={{ color: 'var(--accent-foreground)', willChange: 'transform, opacity' }}
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              </span>
              {isActive && (
                <span
                  className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-2 h-2 rounded-full z-[4]"
                  style={{ background: 'var(--pill-bg)' }}
                  aria-hidden="true"
                />
              )}
            </>
          )

          return (
            <li key={item.href} role="none" className="flex h-full">
              <Link
                role="menuitem"
                href={item.href}
                className={basePillClasses}
                style={pillStyle}
                aria-label={item.ariaLabel || item.label}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
              >
                {PillContent}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

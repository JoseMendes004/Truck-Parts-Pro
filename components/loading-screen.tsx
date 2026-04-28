'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLoading } from '@/contexts/loading-context';

const CONFIG = {
  WORLD_SIZE: 10,
  EXTRUDE_DEPTH: 1.0,
  HOLD_MS: 800,
  TRANS_MS: 1500,
};

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
];

const Utils = {
  normalize: (fig: any) => {
    const [vx, vy, vw, vh] = fig.vb;
    const scale = CONFIG.WORLD_SIZE / Math.max(vw, vh);
    return fig.pieces.map((pts: any) =>
      pts.map(([x, y]: [number, number]) => [
        (x - vx - vw / 2) * scale,
        -(y - vy - vh / 2) * scale,
      ])
    );
  },
  decompose: (pts: any) => {
    const centroid = [0, 0];
    pts.forEach((p: any) => {
      centroid[0] += p[0];
      centroid[1] += p[1];
    });
    centroid[0] /= pts.length;
    centroid[1] /= pts.length;

    const local = pts.map((p: any) => [p[0] - centroid[0], p[1] - centroid[1]]);
    let angle = Math.atan2(local[1][1] - local[0][1], local[1][0] - local[0][0]);

    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const base = local.map((p: any) => [
      p[0] * cos - p[1] * sin,
      p[0] * sin + p[1] * cos,
    ]);

    return { centroid, angle, base };
  },
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  lerpAngle: (a: number, b: number, t: number) => {
    const diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    return a + (diff < -Math.PI ? diff + Math.PI * 2 : diff) * t;
  },
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export const LoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const { isLoading, hideLoading, showLoading, isLoadingScreenEnabled } = useLoading();
  const [shouldRender, setShouldRender] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!isLoadingScreenEnabled) {
      setShouldRender(false);
      return;
    }
    if (isLoading) {
      setShouldRender(true);
      setOpacity(1);
    } else {
      setOpacity(0);
      const timer = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoadingScreenEnabled]);

  useEffect(() => {
    // We no longer use a fixed timeout here. 
    // The hideLoading() will be called from the animation loop.
    
    const handleBeforeUnload = () => {
      if (isLoadingScreenEnabled) showLoading();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showLoading, isLoadingScreenEnabled]);

  useEffect(() => {
    if (!shouldRender || !containerRef.current) return;

    // Small delay to ensure ThemeProvider has applied variables
    const initTimer = setTimeout(() => {
      if (!containerRef.current) return;

      // Helper to resolve CSS variables (including oklch) to RGB strings
      const resolveColor = (cssVar: string) => {
        const temp = document.createElement('div');
        temp.style.color = `var(${cssVar})`;
        temp.style.display = 'none';
        document.body.appendChild(temp);
        const computed = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        return computed;
      };

      // Read colors from CSS variables
      const accentRGB = resolveColor('--accent') || '#3b82f6';
      const bgRGB = resolveColor('--background') || '#0f172a';
      
      const accentColor = new THREE.Color(accentRGB);
      
      // Generate a variation of colors based on accent
      const hsl = { h: 0, s: 0, l: 0 };
      accentColor.getHSL(hsl);
      const PIECE_COLORS = Array.from({ length: 7 }, () => {
        const color = new THREE.Color();
        color.setHSL(hsl.h, hsl.s, hsl.l);
        return color;
      });

      const baseFigures = RAW_FIGURES.map((raw) => ({
        label: raw.label,
        props: Utils.normalize(raw).map(Utils.decompose),
      }));

      const figures = [
        // Hidden 'Scattered' state for the intro
        {
          label: "scattered",
          props: baseFigures[0].props.map((p: any) => ({
            ...p,
            centroid: [
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ],
            angle: Math.random() * Math.PI * 4
          }))
        },
        ...baseFigures
      ];

      // Scene setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      containerRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 25);

      // Lights - Increased intensities for a brighter scene
      const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambLight);

      const spotLight = new THREE.SpotLight(0xffffff, 2000);
      spotLight.position.set(15, 20, 25);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.set(1024, 1024);
      scene.add(spotLight);

      const fillLight = new THREE.PointLight(accentColor, 800);
      fillLight.position.set(-15, -10, 10);
      scene.add(fillLight);

      // Pieces
      const pieces: any[] = [];
      const group = new THREE.Group();
      scene.add(group);

      for (let i = 0; i < 7; i++) {
        const pGroup = new THREE.Group();
        const { base } = figures[0].props[i];

        const shape = new THREE.Shape();
        shape.moveTo(base[0][0], base[0][1]);
        for (let j = 1; j < base.length; j++) shape.lineTo(base[j][0], base[j][1]);
        shape.closePath();

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: CONFIG.EXTRUDE_DEPTH,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 3,
        });
        geo.translate(0, 0, -CONFIG.EXTRUDE_DEPTH / 2);

        const mat = new THREE.MeshPhysicalMaterial({
          color: PIECE_COLORS[i],
          roughness: 0.1,
          metalness: 0.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        pGroup.add(mesh);
        group.add(pGroup);
        pieces.push({ group: pGroup, mesh: mesh });
      }

      let startTime: number | null = null;
      let animationId: number;

      const animate = (now: number) => {
        if (!startTime) startTime = now;

        const phaseMs = CONFIG.HOLD_MS + CONFIG.TRANS_MS;
        const cycleMs = phaseMs * figures.length;
        const elapsed = (now - startTime) % cycleMs;
        const phaseIndex = Math.floor(elapsed / phaseMs);
        const phaseElapsed = elapsed % phaseMs;

        const fromFig = figures[phaseIndex];
        const toFig = figures[(phaseIndex + 1) % figures.length];

        let t = 0,
          jump = 0,
          extraRot = 0;
        if (phaseElapsed > CONFIG.HOLD_MS) {
          const rawT = (phaseElapsed - CONFIG.HOLD_MS) / CONFIG.TRANS_MS;
          t = Utils.easeInOutCubic(rawT);
          jump = Math.sin(t * Math.PI) * 5.0; 
          extraRot = Math.sin(t * Math.PI) * 0.6;
        }

        if (phaseIndex >= figures.length - 1 && phaseElapsed > CONFIG.HOLD_MS * 0.8 && isLoading) {
           hideLoading();
        }

        pieces.forEach((p, i) => {
          const p1 = fromFig.props[i];
          const p2 = toFig.props[i];

          // Radial expansion like in figura.html
          let expansion = 0;
          if (phaseElapsed > CONFIG.HOLD_MS) {
            const rawT = (phaseElapsed - CONFIG.HOLD_MS) / CONFIG.TRANS_MS;
            expansion = Math.sin(Utils.easeInOutCubic(rawT) * Math.PI) * 1.5;
          }

          const cx = Utils.lerp(p1.centroid[0], p2.centroid[0], t);
          const cy = Utils.lerp(p1.centroid[1], p2.centroid[1], t);
          
          p.group.position.set(
            cx * (1 + expansion),
            cy * (1 + expansion),
            jump
          );

          p.group.rotation.set(
            extraRot,
            extraRot * 0.5,
            Utils.lerpAngle(p1.angle, p2.angle, t)
          );

          const baseInterp = p1.base.map((pt: any, j: number) => [
            Utils.lerp(pt[0], p2.base[j][0], t),
            Utils.lerp(pt[1], p2.base[j][1], t),
          ]);

          const shape = new THREE.Shape();
          shape.moveTo(baseInterp[0][0], baseInterp[0][1]);
          for (let j = 1; j < baseInterp.length; j++)
            shape.lineTo(baseInterp[j][0], baseInterp[j][1]);
          shape.closePath();

          p.mesh.geometry.dispose();
          p.mesh.geometry = new THREE.ExtrudeGeometry(shape, {
            depth: CONFIG.EXTRUDE_DEPTH,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3,
          });
          p.mesh.geometry.translate(0, 0, -CONFIG.EXTRUDE_DEPTH / 2);
        });

        // Floating animation like in figura.html
        group.rotation.y = Math.sin(now * 0.0005) * 0.15;
        group.rotation.x = 0.2 + Math.cos(now * 0.0004) * 0.1;
        group.position.y = 2.0 + Math.sin(now * 0.0006) * 0.8;

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      engineRef.current = {
        cleanup: () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
      };
    }, 100); // 100ms delay to let theme settle

    return () => {
      clearTimeout(initTimer);
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--background)',
        backgroundImage: 'radial-gradient(circle at center, color-mix(in srgb, var(--background), white 10%) 0%, var(--background) 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: opacity,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: 'none'
      }}
      ref={containerRef}
    >
      <style>{`
        .brand-text {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%) perspective(1000px) rotateX(15deg);
          text-align: center;
          color: var(--foreground);
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 0.85;
          pointer-events: none;
          user-select: none;
        }
        .brand-main {
          font-size: 3.5rem;
          display: block;
          text-shadow: 2px 2px 0px var(--accent), 4px 4px 0px rgba(0,0,0,0.2);
        }
        .brand-pro {
          font-size: 4.5rem;
          display: block;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--foreground);
          filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.2));
        }
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
      <div className="vignette" />
      <div className="brand-text">
        <span className="brand-main">TruckParts</span>
        <span className="brand-pro">Pro</span>
      </div>
    </div>
  );
};

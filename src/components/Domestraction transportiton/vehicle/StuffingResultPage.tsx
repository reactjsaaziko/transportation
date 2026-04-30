import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { FileText, Copy, RefreshCw } from "lucide-react";
import type { CalculateMultipleContainersMinimalResponse } from "./types";

const Container3DScene = lazy(() => import("./Container3DScene"));

interface CargoItem {
  name: string;
  packages: number;
  volume: number;
  weight: number;
  color: string;
  icon: string;
  cargoType?: string;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
}

interface StuffingResultPageProps {
  containerType?: string;
  containerName?: string;
  containerSize?: "20ft" | "40ft";
  totalPackages?: number;
  cargoVolume?: number;
  volumePercentage?: number;
  cargoWeight?: number;
  weightPercentage?: number;
  maxWeight?: number;
  totalVolume?: number;
  cargoItems?: CargoItem[];
  apiResponse?: CalculateMultipleContainersMinimalResponse;
  onBack?: () => void;
}

const FALLBACK_CARGO_ITEMS: CargoItem[] = [
  {
    name: "Big bags",
    packages: 80,
    volume: 10,
    weight: 9000,
    color: "#7c3aed",
    icon: "📦",
    cargoType: "big-bag",
    lengthMm: 1000,
    widthMm: 1000,
    heightMm: 1000,
  },
  {
    name: "Sacks",
    packages: 10,
    volume: 13.5,
    weight: 4500,
    color: "#22c55e",
    icon: "🎒",
    cargoType: "sack",
    lengthMm: 800,
    widthMm: 600,
    heightMm: 400,
  },
  {
    name: "Boxes 1",
    packages: 100,
    volume: 4.8,
    weight: 800,
    color: "#0ea5e9",
    icon: "🧱",
    cargoType: "box",
    lengthMm: 500,
    widthMm: 400,
    heightMm: 300,
  },
];

/* ═══════════════════════════════════════════════════════════
   CSS 3D Container Visualization — Wireframe style
   - Wireframe dashed transparent walls
   - Orange pallet base
   - View presets (3D, Front, Top, Side)
   - Scroll zoom, pointer drag rotation
   ═══════════════════════════════════════════════════════════ */

interface Container3DViewProps {
  cargoItems: CargoItem[];
  fillPercentage: number;
  totalPackages: number;
  containerSize?: "20ft" | "40ft";
}

// Real container internal dimensions in mm
const CONTAINER_DIMS: Record<
  string,
  { length: number; width: number; height: number }
> = {
  "20ft": { length: 5896, width: 2350, height: 2392 },
  "40ft": { length: 12032, width: 2350, height: 2392 },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Container3DView: React.FC<Container3DViewProps> = ({
  cargoItems,
  containerSize = "20ft",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const VIEW_PRESETS = [
    { label: "3D", x: -22, y: -30 },
    { label: "Front", x: -5, y: 0 },
    { label: "Top", x: -78, y: -25 },
    { label: "Side", x: -15, y: -75 },
  ];

  const [activeView, setActiveView] = useState(0);
  const rotationRef = useRef({ x: VIEW_PRESETS[0].x, y: VIEW_PRESETS[0].y });
  const zoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const isHovered = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Progressive loading state
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyTransform = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { x, y } = rotationRef.current;
    el.style.transform = `scale(${zoomRef.current}) rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.transition = "none";
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      rotationRef.current = {
        x: Math.max(-80, Math.min(80, rotationRef.current.x + dy * 0.4)),
        y: rotationRef.current.y + dx * 0.4,
      };
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          applyTransform();
        });
      }
    },
    [applyTransform],
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    if (containerRef.current)
      containerRef.current.style.transition = "transform 0.12s ease-out";
  }, []);

  // Scroll zoom
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!isHovered.current) return;
      e.preventDefault();
      zoomRef.current = Math.min(
        2.5,
        Math.max(0.4, zoomRef.current - e.deltaY * 0.001),
      );
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          applyTransform();
        });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyTransform]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  // Scene pixel dimensions
  const is20 = containerSize === "20ft";
  const SCENE_WIDTH = is20 ? 240 : 400;
  const baseH = 8;
  const cWid = 112;
  const cHgt = 112;

  // Real container dimensions
  const realDims = CONTAINER_DIMS[containerSize] || CONTAINER_DIMS["20ft"];

  // Scale factors: mm → px
  const scaleL = SCENE_WIDTH / realDims.length;
  const scaleW = cWid / realDims.width;
  const scaleH = cHgt / realDims.height;

  // Build ALL cargo boxes
  const cargoBoxes = useMemo(() => {
    const boxes: {
      x: number;
      y: number;
      z: number;
      w: number;
      h: number;
      d: number;
      color: string;
    }[] = [];
    const totalAllPackages = cargoItems.reduce((s, i) => s + i.packages, 0);
    if (totalAllPackages === 0) return boxes;

    const itemSpecs = cargoItems.map((item) => {
      let bL: number, bW: number, bH: number;
      if (item.lengthMm && item.widthMm && item.heightMm) {
        bL = item.lengthMm;
        bW = item.widthMm;
        bH = item.heightMm;
      } else if (item.packages > 0) {
        const volPerPkg = (item.volume / item.packages) * 1e9;
        const side = Math.cbrt(volPerPkg);
        bL = side;
        bW = side;
        bH = side;
      } else {
        bL = 500;
        bW = 500;
        bH = 500;
      }
      return { item, bL, bW, bH };
    });

    const capacityAtScale = (s: number) => {
      let cap = 0;
      for (const { item, bL, bW, bH } of itemSpecs) {
        const pw = Math.max(4, bL * scaleL * s);
        const pd = Math.max(4, bW * scaleW * s);
        const ph = Math.max(4, bH * scaleH * s);
        const cols = Math.max(1, Math.floor(SCENE_WIDTH / pw));
        const deps = Math.max(1, Math.floor(cWid / pd));
        const stks = Math.max(1, Math.floor(cHgt / ph));
        cap += Math.min(item.packages, cols * deps * stks);
      }
      return cap;
    };

    const findScale = (searchLo: number, searchHi: number) => {
      let lo = searchLo,
        hi = searchHi;
      for (let iter = 0; iter < 30; iter++) {
        const mid = (lo + hi) / 2;
        if (capacityAtScale(mid) >= totalAllPackages) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    const capAtOne = capacityAtScale(1.0);
    let vScale: number;
    if (capAtOne >= totalAllPackages) {
      const minPx = Math.min(
        ...itemSpecs.map(({ bL, bW, bH }) =>
          Math.min(bL * scaleL, bW * scaleW, bH * scaleH),
        ),
      );
      if (minPx < 8) {
        vScale = findScale(1.0, 20.0);
      } else {
        vScale = 1.0;
      }
    } else {
      vScale = findScale(0.01, 1.0);
    }

    let globalYUsed = 0;

    for (const { item, bL, bW, bH } of itemSpecs) {
      if (item.packages <= 0) continue;

      const pxW = Math.max(4, bL * scaleL * vScale);
      const pxD = Math.max(4, bW * scaleW * vScale);
      const pxH = Math.max(4, bH * scaleH * vScale);

      const colsAlong = Math.max(1, Math.floor(SCENE_WIDTH / pxW));
      const depthLayers = Math.max(1, Math.floor(cWid / pxD));
      const availableH = cHgt - globalYUsed;
      const stackLayers = Math.max(1, Math.floor(availableH / pxH));

      const toPlace = item.packages;
      let placed = 0;
      let maxSy = 0;

      for (let sy = 0; sy < stackLayers && placed < toPlace; sy++) {
        for (let sz = 0; sz < depthLayers && placed < toPlace; sz++) {
          for (let sx = 0; sx < colsAlong && placed < toPlace; sx++) {
            const x = sx * pxW;
            const y = cHgt - globalYUsed - (sy + 1) * pxH;
            const z = -cWid / 2 + sz * pxD + pxD / 2;

            boxes.push({ x, y, z, w: pxW, h: pxH, d: pxD, color: item.color });
            placed++;
            maxSy = Math.max(maxSy, sy + 1);
          }
        }
      }

      globalYUsed += maxSy * pxH;
    }
    return boxes;
  }, [cargoItems, scaleL, scaleW, scaleH, cWid, cHgt, SCENE_WIDTH]);

  // Progressive loading animation
  const startLoading = useCallback(() => {
    if (loadingRef.current) clearInterval(loadingRef.current);
    setVisibleCount(0);
    setIsLoading(true);

    const total = cargoBoxes.length;
    if (total === 0) {
      setIsLoading(false);
      return;
    }

    const ANIM_DURATION_MS = 2000;
    const INTERVAL_MS = 33;
    const totalSteps = Math.ceil(ANIM_DURATION_MS / INTERVAL_MS);
    const batchSize = Math.max(1, Math.ceil(total / totalSteps));

    let current = 0;
    loadingRef.current = setInterval(() => {
      current += batchSize;
      if (current >= total) {
        current = total;
        if (loadingRef.current) clearInterval(loadingRef.current);
        loadingRef.current = null;
        setIsLoading(false);
      }
      setVisibleCount(current);
    }, INTERVAL_MS);
  }, [cargoBoxes.length]);

  useEffect(() => {
    startLoading();
    return () => {
      if (loadingRef.current) clearInterval(loadingRef.current);
    };
  }, [startLoading]);

  const adjustColor = useCallback((hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }, []);

  const colorCache = useMemo(() => {
    const cache: Record<
      string,
      { light: string; dark: string; border: string }
    > = {};
    for (const item of cargoItems) {
      if (!cache[item.color]) {
        cache[item.color] = {
          light: adjustColor(item.color, 30),
          dark: adjustColor(item.color, -40),
          border: adjustColor(item.color, -60),
        };
      }
    }
    return cache;
  }, [cargoItems, adjustColor]);

  const orange = "#E8A838";
  const orangeDark = "#CC8A20";

  const f = (transform: string, w: number, h: number): React.CSSProperties => ({
    position: "absolute",
    width: w,
    height: h,
    backfaceVisibility: "visible",
    transform,
    transformOrigin: "center center",
  });

  const baseLen = SCENE_WIDTH;

  const visibleBoxes = useMemo(() => {
    return cargoBoxes.slice(0, visibleCount);
  }, [cargoBoxes, visibleCount]);

  const useSimpleRender = cargoBoxes.length > 200;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-xl select-none"
      style={{ height: 320, background: "#f5f6f8", cursor: "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        handlePointerUp();
        isHovered.current = false;
      }}
      onMouseEnter={() => {
        isHovered.current = true;
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
    >
      {/* Refresh button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          startLoading();
        }}
        className="absolute top-2 left-3 z-10 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-500 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50"
        title="Replay packing animation"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
        />
        {isLoading ? "Loading..." : "Refresh"}
      </button>

      {/* Drag hint */}
      <div className="absolute top-2 right-3 z-10 flex items-center gap-1 text-xs text-gray-400 select-none pointer-events-none">
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        Drag to rotate
      </div>

      {/* Loading progress badge */}
      <div className="absolute bottom-2 left-3 z-10 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-700 backdrop-blur-sm pointer-events-none select-none">
        {isLoading ? (
          <>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Loading {visibleCount} / {cargoBoxes.length} items...
          </>
        ) : (
          <>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            {cargoBoxes.length} items loaded
          </>
        )}
      </div>

      {/* 3D Scene */}
      <div
        style={{
          width: "100%",
          height: "100%",
          perspective: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: baseLen,
            height: cHgt,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `scale(${zoomRef.current}) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`,
            transition: "transform 0.12s ease-out",
            willChange: "transform",
          }}
        >
          {/* ORANGE BASE */}
          <div style={{ transformStyle: "preserve-3d" }}>
            <div
              style={{
                ...f(
                  `rotateX(-90deg) translateZ(${cHgt / 2 + baseH / 2}px)`,
                  baseLen,
                  cWid,
                ),
                background: orange,
                top: (cHgt - cWid) / 2 + baseH / 2,
              }}
            />
            <div
              style={{
                ...f(`translateZ(${cWid / 2}px)`, baseLen, baseH),
                background: orange,
                top: cHgt,
              }}
            />
            <div
              style={{
                ...f(
                  `rotateY(180deg) translateZ(${cWid / 2}px)`,
                  baseLen,
                  baseH,
                ),
                background: orangeDark,
                top: cHgt,
              }}
            />
            <div
              style={{
                ...f(
                  `rotateY(90deg) translateZ(${baseLen / 2}px)`,
                  cWid,
                  baseH,
                ),
                background: orangeDark,
                top: cHgt,
                left: (baseLen - cWid) / 2,
              }}
            />
            <div
              style={{
                ...f(
                  `rotateY(-90deg) translateZ(${baseLen / 2}px)`,
                  cWid,
                  baseH,
                ),
                background: orange,
                top: cHgt,
                left: (baseLen - cWid) / 2,
              }}
            />
          </div>

          {/* CONTAINER WALLS (wireframe) */}
          <div style={{ transformStyle: "preserve-3d" }}>
            <div
              style={{
                ...f(`translateZ(${cWid / 2}px)`, baseLen, cHgt),
                border: "1.5px dashed rgba(150,170,200,0.35)",
                background: "transparent",
                top: 0,
              }}
            />
            <div
              style={{
                ...f(
                  `rotateY(180deg) translateZ(${cWid / 2}px)`,
                  baseLen,
                  cHgt,
                ),
                border: "1.5px dashed rgba(150,170,200,0.35)",
                background: "transparent",
                top: 0,
              }}
            />
            <div
              style={{
                ...f(
                  `rotateY(-90deg) translateZ(${baseLen / 2}px)`,
                  cWid,
                  cHgt,
                ),
                border: "1.5px dashed rgba(150,170,200,0.35)",
                background: "transparent",
                top: 0,
                left: (baseLen - cWid) / 2,
              }}
            />
            <div
              style={{
                ...f(`rotateY(90deg) translateZ(${baseLen / 2}px)`, cWid, cHgt),
                border: "1.5px dashed rgba(150,170,200,0.35)",
                background: "transparent",
                top: 0,
                left: (baseLen - cWid) / 2,
              }}
            />
            <div
              style={{
                ...f(`rotateX(90deg) translateZ(${cHgt / 2}px)`, baseLen, cWid),
                border: "1.5px dashed rgba(150,170,200,0.25)",
                background: "rgba(200,215,240,0.06)",
                top: (cHgt - cWid) / 2,
              }}
            />
          </div>

          {/* CARGO BOXES */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: baseLen,
              height: cHgt,
              transformStyle: "preserve-3d",
            }}
          >
            {visibleBoxes.map((box, idx) => {
              const colors = colorCache[box.color] || {
                light: box.color,
                dark: box.color,
                border: box.color,
              };
              const hw = box.w / 2;
              const hh = box.h / 2;
              const hd = box.d / 2;
              const bdr = `0.5px solid ${colors.border}`;
              const face: React.CSSProperties = {
                position: "absolute",
                boxSizing: "border-box",
                border: bdr,
              };

              if (useSimpleRender) {
                return (
                  <div
                    key={`box-${idx}`}
                    style={{
                      position: "absolute",
                      left: box.x,
                      top: box.y,
                      width: box.w,
                      height: box.h,
                      transformStyle: "preserve-3d",
                      transform: `translateZ(${box.z}px)`,
                    }}
                  >
                    <div
                      style={{
                        ...face,
                        width: box.w,
                        height: box.h,
                        background: box.color,
                        transform: `translateZ(${hd}px)`,
                      }}
                    />
                    <div
                      style={{
                        ...face,
                        width: box.w,
                        height: box.h,
                        background: colors.dark,
                        transform: `rotateY(180deg) translateZ(${hd}px)`,
                      }}
                    />
                    <div
                      style={{
                        ...face,
                        width: box.w,
                        height: box.d,
                        background: colors.light,
                        top: (box.h - box.d) / 2,
                        transform: `rotateX(90deg) translateZ(${hh}px)`,
                      }}
                    />
                    <div
                      style={{
                        ...face,
                        width: box.w,
                        height: box.d,
                        background: colors.dark,
                        top: (box.h - box.d) / 2,
                        transform: `rotateX(-90deg) translateZ(${hh}px)`,
                      }}
                    />
                    <div
                      style={{
                        ...face,
                        width: box.d,
                        height: box.h,
                        background: colors.light,
                        transform: `rotateY(-90deg) translateZ(${hw}px)`,
                        left: (box.w - box.d) / 2,
                      }}
                    />
                    <div
                      style={{
                        ...face,
                        width: box.d,
                        height: box.h,
                        background: colors.dark,
                        transform: `rotateY(90deg) translateZ(${hw}px)`,
                        left: (box.w - box.d) / 2,
                      }}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`box-${idx}`}
                  style={{
                    position: "absolute",
                    left: box.x,
                    top: box.y,
                    width: box.w,
                    height: box.h,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${box.z}px)`,
                  }}
                >
                  <div
                    style={{
                      ...face,
                      width: box.w,
                      height: box.h,
                      background: box.color,
                      transform: `translateZ(${hd}px)`,
                    }}
                  />
                  <div
                    style={{
                      ...face,
                      width: box.w,
                      height: box.h,
                      background: colors.dark,
                      transform: `rotateY(180deg) translateZ(${hd}px)`,
                    }}
                  />
                  <div
                    style={{
                      ...face,
                      width: box.w,
                      height: box.d,
                      background: colors.light,
                      top: (box.h - box.d) / 2,
                      transform: `rotateX(90deg) translateZ(${hh}px)`,
                    }}
                  />
                  <div
                    style={{
                      ...face,
                      width: box.w,
                      height: box.d,
                      background: colors.dark,
                      top: (box.h - box.d) / 2,
                      transform: `rotateX(-90deg) translateZ(${hh}px)`,
                    }}
                  />
                  <div
                    style={{
                      ...face,
                      width: box.d,
                      height: box.h,
                      background: colors.light,
                      transform: `rotateY(-90deg) translateZ(${hw}px)`,
                      left: (box.w - box.d) / 2,
                    }}
                  />
                  <div
                    style={{
                      ...face,
                      width: box.d,
                      height: box.h,
                      background: colors.dark,
                      transform: `rotateY(90deg) translateZ(${hw}px)`,
                      left: (box.w - box.d) / 2,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* View preset cycling button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const next = (activeView + 1) % VIEW_PRESETS.length;
          setActiveView(next);
          rotationRef.current = {
            x: VIEW_PRESETS[next].x,
            y: VIEW_PRESETS[next].y,
          };
          if (containerRef.current)
            containerRef.current.style.transition = "transform 0.35s ease-out";
          applyTransform();
        }}
        className="absolute bottom-2 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-500 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50"
        title="Cycle view angle"
      >
        {VIEW_PRESETS[activeView].label} view
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Donut Chart (SVG)
   ═══════════════════════════════════════════════════════════ */
const DonutChart: React.FC<{ items: CargoItem[] }> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.packages, 0);
  if (total === 0) return null;

  let currentAngle = 0;
  const segments = items.map((item) => {
    const pct = (item.packages / total) * 100;
    const angle = (pct / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...item, pct, startAngle, endAngle: currentAngle };
  });

  const cx = 90,
    cy = 90,
    R = 72,
    r = 50;

  return (
    <svg viewBox="0 0 180 180" className="h-44 w-44">
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="22"
      />
      {segments.map((seg, i) => {
        const a1 = ((seg.startAngle - 90) * Math.PI) / 180;
        const a2 = ((seg.endAngle - 90) * Math.PI) / 180;
        const x1o = cx + R * Math.cos(a1);
        const y1o = cy + R * Math.sin(a1);
        const x2o = cx + R * Math.cos(a2);
        const y2o = cy + R * Math.sin(a2);
        const x1i = cx + r * Math.cos(a2);
        const y1i = cy + r * Math.sin(a2);
        const x2i = cx + r * Math.cos(a1);
        const y2i = cy + r * Math.sin(a1);
        const large = seg.endAngle - seg.startAngle > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M${x1o} ${y1o} A${R} ${R} 0 ${large} 1 ${x2o} ${y2o} L${x1i} ${y1i} A${r} ${r} 0 ${large} 0 ${x2i} ${y2i}Z`}
            fill={seg.color}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill="white" />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════ */
const StuffingResultPage: React.FC<StuffingResultPageProps> = ({
  containerType: _containerType = "20' Standard",
  containerName: _containerName = "20' Standard #1",
  containerSize = "20ft",
  totalPackages = 190,
  cargoVolume = 28.3,
  volumePercentage = 85,
  cargoWeight = 14300,
  weightPercentage = 50,
  maxWeight = 14300,
  totalVolume = 28.3,
  cargoItems = FALLBACK_CARGO_ITEMS,
  apiResponse,
  onBack,
}) => {
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(0);

  const containerCount = apiResponse?.containers?.length || 1;
  const hasMultipleContainers = containerCount > 1;

  // The transport-service multi-container loader has known bugs in several
  // optimization paths where `cargoDetails[].quantity` and `containerSummary`
  // do not reflect the true per-container split (sometimes every container
  // duplicates the grand total; sometimes only one container holds the entire
  // order while siblings show zero). To guarantee the UI is internally
  // consistent we re-derive each container's share from authoritative inputs:
  //   - the user's true grand total (`totalPackages` prop), and
  //   - each container's reported `utilization.cargoVolume` percentage,
  // which is the only signal the backend produces consistently across paths.
  const apportionFactors = useMemo<number[] | null>(() => {
    if (!hasMultipleContainers || !apiResponse?.containers) return null;
    const containers = apiResponse.containers;
    if (containers.length < 2) return null;

    const sumQty = containers.reduce(
      (s, c) =>
        s + (c.cargoDetails || []).reduce((a, d) => a + (d.quantity || 0), 0),
      0,
    );
    // If the backend's per-container quantities already sum to the user's
    // grand total AND no container hogs more than its fair share, trust it.
    const fairShareCap = totalPackages * 0.6;
    const anyHogging = containers.some(
      (c) =>
        (c.cargoDetails || []).reduce((a, d) => a + (d.quantity || 0), 0) >
        fairShareCap,
    );
    if (sumQty === totalPackages && !anyHogging) return null;

    const utilPcts = containers.map((c) => {
      const m = c?.utilization?.cargoVolume?.match(/([\d.]+)%/);
      return m ? parseFloat(m[1]) : 0;
    });
    const totalUtil = utilPcts.reduce((s, v) => s + v, 0);
    if (totalUtil <= 0) return containers.map(() => 1 / containers.length);
    return utilPcts.map((p) => p / totalUtil);
  }, [hasMultipleContainers, apiResponse, totalPackages]);

  // Build per-container cargo items from API response
  const activeContainerCargoItems = useMemo<CargoItem[]>(() => {
    if (!hasMultipleContainers || !apiResponse?.containers) return cargoItems;

    const container = apiResponse.containers[selectedContainerIndex];
    if (!container?.cargoDetails) return cargoItems;

    const factor = apportionFactors?.[selectedContainerIndex];

    // Find the matching input row for a given API cargoDetail. Multiple input
    // rows may share the same `productName` (e.g. two "new product" rows of
    // different types), so we disambiguate by also checking `cargoType`.
    // Without this, Box rows would borrow the Barrel row's cargoType and
    // render as cylinders in the 3D scene.
    const findOriginal = (detail: { productName: string; cargoType?: string }) => {
      if (detail.cargoType) {
        const exact = cargoItems.find(
          (c) =>
            c.name === detail.productName && c.cargoType === detail.cargoType,
        );
        if (exact) return exact;
      }
      return cargoItems.find((c) => c.name === detail.productName);
    };

    return container.cargoDetails.map((detail) => {
      const original = findOriginal(detail);
      // When apportionFactors is set, ignore the backend's per-container
      // quantity entirely and recompute this container's share from the
      // user's authoritative input total weighted by volume utilization.
      const rawQty = detail.quantity || 0;
      const rawVol = parseFloat(detail.totalVolume?.replace(/[^\d.]/g, "") || "0");
      const rawWt = parseFloat(detail.totalWeight?.replace(/[^\d.]/g, "") || "0");

      const matchingInput = original;
      const trueOrderQty = matchingInput?.packages ?? totalPackages;
      const trueOrderVol = matchingInput?.volume ?? 0;
      const trueOrderWt = matchingInput?.weight ?? 0;

      const packages =
        factor !== undefined ? Math.round(trueOrderQty * factor) : rawQty;
      const volume =
        factor !== undefined ? trueOrderVol * factor : rawVol;
      const weight =
        factor !== undefined ? trueOrderWt * factor : rawWt;
      return {
        name: detail.productName,
        packages,
        volume,
        weight,
        color: original?.color || "#6366f1",
        icon: original?.icon || "📦",
        cargoType: original?.cargoType,
        lengthMm: original?.lengthMm,
        widthMm: original?.widthMm,
        heightMm: original?.heightMm,
      };
    });
  }, [
    hasMultipleContainers,
    apiResponse,
    selectedContainerIndex,
    cargoItems,
    apportionFactors,
    totalPackages,
  ]);

  // Per-container stats
  const activeContainerStats = useMemo(() => {
    if (!hasMultipleContainers || !apiResponse?.containers) {
      return {
        packages: totalPackages,
        volumePct: volumePercentage,
        weightPct: weightPercentage,
        usedVolume: cargoVolume,
        usedWeight: cargoWeight,
        maxVol: totalVolume,
        maxWt: maxWeight,
      };
    }
    const c = apiResponse.containers[selectedContainerIndex];
    const volMatch = c?.utilization?.cargoVolume?.match(/([\d.]+)%/);
    const wtMatch = c?.utilization?.cargoWeight?.match(/([\d.]+)%/);
    const usedVol = parseFloat(
      c?.utilization?.cargoVolume?.match(/([\d.]+)\s*m/)?.[1] || "0",
    );
    const remVol = parseFloat(
      c?.utilization?.remainingVolume?.match(/([\d.]+)/)?.[1] || "0",
    );
    const usedWt = parseFloat(
      c?.utilization?.cargoWeight?.match(/([\d.]+)\s*kg/)?.[1] || "0",
    );
    const remWt = parseFloat(
      c?.utilization?.remainingWeight?.match(/([\d.]+)/)?.[1] || "0",
    );
    return {
      // Use the per-container cargoDetails sum (same source the 3D scene
      // renders from) so the "items loaded" counts match. The backend's
      // containerSummary.totalPackages can return the grand total across
      // every container, which makes Container 1's badge show the full order.
      packages: activeContainerCargoItems.reduce(
        (s, i) => s + i.packages,
        0,
      ),
      volumePct: volMatch ? parseInt(volMatch[1]) : volumePercentage,
      weightPct: wtMatch ? parseInt(wtMatch[1]) : weightPercentage,
      usedVolume:
        usedVol || activeContainerCargoItems.reduce((s, i) => s + i.volume, 0),
      usedWeight:
        usedWt || activeContainerCargoItems.reduce((s, i) => s + i.weight, 0),
      maxVol: usedVol + remVol || totalVolume,
      maxWt: usedWt + remWt || maxWeight,
    };
  }, [
    hasMultipleContainers,
    apiResponse,
    selectedContainerIndex,
    activeContainerCargoItems,
    totalPackages,
    volumePercentage,
    weightPercentage,
    cargoVolume,
    cargoWeight,
    totalVolume,
    maxWeight,
  ]);

  const displayCargoItems = hasMultipleContainers
    ? activeContainerCargoItems
    : cargoItems;
  const hasCargoItems = displayCargoItems.length > 0;
  const totalCargoVolume = displayCargoItems.reduce((s, c) => s + c.volume, 0);
  const totalCargoWeight = displayCargoItems.reduce((s, c) => s + c.weight, 0);
  const displayPackages = hasMultipleContainers
    ? activeContainerStats.packages
    : totalPackages;
  const displayVolumePct = hasMultipleContainers
    ? activeContainerStats.volumePct
    : volumePercentage;
  const displayWeightPct = hasMultipleContainers
    ? activeContainerStats.weightPct
    : weightPercentage;
  const displayUsedVolume = hasMultipleContainers
    ? activeContainerStats.usedVolume
    : cargoVolume;
  const displayUsedWeight = hasMultipleContainers
    ? activeContainerStats.usedWeight
    : cargoWeight;
  const displayMaxVolume = hasMultipleContainers
    ? activeContainerStats.maxVol
    : totalVolume;
  const displayMaxWeight = hasMultipleContainers
    ? activeContainerStats.maxWt
    : maxWeight;

  const handleExportPDF = () => console.log("Exporting to PDF...");
  const handleCopyRequest = () => console.log("Copying request...");

  return (
    <div className="bg-slate-50 py-6 text-[15px]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xl overflow-hidden">
          {/* Top Section: 3D Container + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Interactive 3D Container */}
            <div className="relative border-r border-slate-100 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                {hasMultipleContainers ? (
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {apiResponse!.containers.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedContainerIndex(idx)}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedContainerIndex === idx
                            ? "bg-blue-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Container {idx + 1}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${apiResponse ? "bg-green-400" : "bg-amber-400"} animate-pulse`}
                  />
                  <span className="text-xs font-medium text-slate-500">
                    {apiResponse ? "Live API Data" : "Local Data"}
                  </span>
                </div>
              </div>

              <Suspense
                fallback={
                  <div
                    className="flex items-center justify-center w-full rounded-xl bg-gray-50"
                    style={{ height: 320 }}
                  >
                    <span className="text-sm text-gray-400">
                      Loading 3D view...
                    </span>
                  </div>
                }
              >
                <Container3DScene
                  cargoItems={displayCargoItems}
                  fillPercentage={displayVolumePct}
                  totalPackages={displayPackages}
                  containerSize={containerSize}
                  palletInfo={apiResponse?.palletInfo}
                />
              </Suspense>

              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-semibold text-slate-800">
                      {displayPackages} items loaded
                    </span>
                  </span>
                </p>
                <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white">
                  3D view
                </span>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-3">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-blue-600">
                    {apiResponse
                      ? `${apiResponse.totalContainers} container${apiResponse.totalContainers > 1 ? "s" : ""}`
                      : "1 container"}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {displayVolumePct}% full
                  </span>
                  {apiResponse?.overallEfficiency && (
                    <span className="ml-2 text-green-600 font-medium">
                      ({apiResponse.overallEfficiency} efficiency)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Donut Chart + Summary Stats */}
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {hasCargoItems ? (
                    <DonutChart items={displayCargoItems} />
                  ) : (
                    <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-slate-200 text-sm text-slate-400">
                      No data
                    </div>
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Packages
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {displayCargoItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-1.5"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-bold text-slate-800">
                            {item.packages}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Volume
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {totalCargoVolume.toFixed(2)} m³
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          | {displayMaxVolume.toFixed(2)} m³
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Weight
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {totalCargoWeight.toFixed(2)} kg
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          | {displayMaxWeight.toFixed(2)} kg
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                {displayCargoItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {displayPackages} packages
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cargo Volume
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {displayUsedVolume.toFixed(2)} m3
                    <span className="ml-1 text-sm font-medium text-blue-500">
                      ({displayVolumePct}%)
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cargo Weight
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {displayUsedWeight.toFixed(2)} kg
                    <span className="ml-1 text-sm font-medium text-blue-500">
                      ({displayWeightPct}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Details Table */}
          <div className="border-t border-slate-100 p-6 lg:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Packages
                    </th>
                    <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Volume
                    </th>
                    <th className="py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayCargoItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-sm text-slate-500"
                      >
                        Add cargo to see the detailed breakdown.
                      </td>
                    </tr>
                  ) : (
                    displayCargoItems.map((item, index) => (
                      <tr
                        key={`${item.name}-${index}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium text-slate-900">
                              {item.icon} {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center text-sm font-semibold text-slate-900">
                          {item.packages}
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-slate-900">
                          {item.volume.toFixed(2)} m³
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-slate-900">
                          {item.weight.toFixed(2)} kg
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {displayCargoItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                      <td className="py-3 text-sm text-slate-900">Total</td>
                      <td className="py-3 text-center text-sm text-slate-900">
                        {displayPackages}
                      </td>
                      <td className="py-3 text-right text-sm text-slate-900">
                        {totalCargoVolume.toFixed(2)} m³
                      </td>
                      <td className="py-3 text-right text-sm text-slate-900">
                        {totalCargoWeight.toFixed(2)} kg
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* API Container Breakdown */}
          {apiResponse &&
            apiResponse.containers &&
            apiResponse.containers.length > 0 && (
              <div className="border-t border-slate-100 p-6 lg:p-8">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">
                  Container Breakdown
                  {apiResponse.totalCost && (
                    <span className="ml-3 text-sm font-medium text-green-600 normal-case">
                      Est. Cost: {apiResponse.totalCost}
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {apiResponse.containers.map((container: any, idx: number) => (
                    <div
                      key={container.containerId || idx}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {container.containerType}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {container.containerId}
                        </span>
                      </div>

                      {/* Utilization bars */}
                      <div className="space-y-2 mb-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Volume</span>
                            <span className="font-medium text-slate-700">
                              {container.utilization.cargoVolume}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all"
                              style={{
                                width: `${Math.min(100, parseInt(container.utilization.cargoVolume.match(/(\d+)%/)?.[1] || "0"))}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Weight</span>
                            <span className="font-medium text-slate-700">
                              {container.utilization.cargoWeight}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{
                                width: `${Math.min(100, parseInt(container.utilization.cargoWeight.match(/(\d+)%/)?.[1] || "0"))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Remaining capacity */}
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <span className="text-slate-500">Remaining Vol.</span>
                          <p className="font-semibold text-slate-700">
                            {container.utilization.remainingVolume}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <span className="text-slate-500">Remaining Wt.</span>
                          <p className="font-semibold text-slate-700">
                            {container.utilization.remainingWeight}
                          </p>
                        </div>
                      </div>

                      {/* Cargo details */}
                      {container.cargoDetails &&
                        container.cargoDetails.length > 0 && (
                          <div className="border-t border-slate-100 pt-3">
                            <p className="text-xs font-semibold text-slate-500 mb-2">
                              Loaded Cargo
                            </p>
                            <div className="space-y-1.5">
                              {container.cargoDetails.map(
                                (cargo: any, ci: number) => (
                                  <div
                                    key={ci}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-slate-700">
                                      {cargo.productName}
                                      <span className="ml-1 text-slate-400">
                                        x{cargo.quantity}
                                      </span>
                                    </span>
                                    <span className="font-medium text-slate-600">
                                      {cargo.totalVolume} / {cargo.totalWeight}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {/* Container summary */}
                      {container.containerSummary && (
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-800">
                          <span>
                            {container.containerSummary.totalPackages} packages
                          </span>
                          <span>
                            {container.containerSummary.totalVolume} /{" "}
                            {container.containerSummary.totalWeight}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary & Recommendation */}
                {apiResponse.summary && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${apiResponse.summary.allProductsFit ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}
                      >
                        {apiResponse.summary.allProductsFit ? "✓" : "!"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {apiResponse.summary.allProductsFit
                            ? "All products fit"
                            : "Some products may not fit"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {apiResponse.summary.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto optimization info */}
                {apiResponse.autoOptimization?.applied && (
                  <div className="mt-3 rounded-lg bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
                    <span className="font-semibold">Auto-optimized:</span>{" "}
                    {apiResponse.autoOptimization.message}
                  </div>
                )}
              </div>
            )}

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 lg:px-8 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={onBack}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Back
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  Export to PDF
                </button>
                <button
                  onClick={handleCopyRequest}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
                >
                  <Copy className="h-4 w-4" />
                  Copy Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuffingResultPage;

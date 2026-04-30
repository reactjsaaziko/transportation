"use no memo";
/* eslint-disable react/no-unknown-property */
// react-three-fiber's hooks (useFrame, useThree, etc.) run outside React's
// normal render cycle, so the React Compiler's auto-memoization captures
// stale state and breaks the progressive cargo loader. Opt this whole file
// out of the compiler with the "use no memo" directive above.
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   Cargo type → 3D shape mapping
   ═══════════════════════════════════════════════════════════ */

type CargoShapeType =
  | "box"
  | "cylinder"
  | "cylinder-side"
  | "sphere"
  | "flat-box"
  | "bag";

const CARGO_TYPE_SHAPE: Record<string, CargoShapeType> = {
  // Backend API keys (canonical — returned by GET /load-calculator/api/cargo-types)
  box: "box",
  bigbags: "bag",
  sacks: "bag",
  barrels: "cylinder",
  roll: "cylinder-side",
  pipes: "cylinder-side",
  bulk: "box",
  // Legacy / synonym UI keys kept for back-compat
  "big-box": "box",
  crate: "box",
  carton: "box",
  container: "box",
  custom: "box",
  barrel: "cylinder",
  drum: "cylinder",
  ibc: "cylinder",
  bag: "bag",
  "big-bag": "bag",
  sack: "bag",
  pallet: "flat-box",
  bundle: "box",
  tube: "cylinder-side",
  cylinder: "cylinder-side",
};

function getShapeType(cargoType?: string): CargoShapeType {
  return CARGO_TYPE_SHAPE[cargoType || "box"] || "box";
}

/* ═══════════════════════════════════════════════════════════
   Interfaces
   ═══════════════════════════════════════════════════════════ */

export interface CargoItem3D {
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

export interface PalletInfo3D {
  used: boolean;
  pallet?: {
    dimensions: { length: number; width: number; height: number };
    color?: string;
    name?: string;
    type?: string;
  };
}

export interface Container3DSceneProps {
  cargoItems: CargoItem3D[];
  fillPercentage: number;
  totalPackages: number;
  containerSize?: "20ft" | "40ft";
  palletInfo?: PalletInfo3D;
}

/* ═══════════════════════════════════════════════════════════
   Container Dimensions (mm)
   ═══════════════════════════════════════════════════════════ */

const CONTAINER_DIMS: Record<
  string,
  { length: number; width: number; height: number }
> = {
  "20ft": { length: 5896, width: 2350, height: 2392 },
  "40ft": { length: 12032, width: 2350, height: 2392 },
};

/* ═══════════════════════════════════════════════════════════
   Single Cargo Item Mesh
   ═══════════════════════════════════════════════════════════ */

interface CargoMeshProps {
  position: [number, number, number];
  size: [number, number, number]; // [width, height, depth]
  color: string;
  shapeType: CargoShapeType;
  visible: boolean;
}

const CargoMesh: React.FC<CargoMeshProps> = React.memo(
  ({ position, size, color, shapeType, visible }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [w, h, d] = size;

    const material = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.5,
        metalness: 0.1,
        transparent: !visible,
        opacity: visible ? 1 : 0,
      });
    }, [color, visible]);

    const edgeMaterial = useMemo(() => {
      const c = new THREE.Color(color);
      c.multiplyScalar(0.6);
      return new THREE.LineBasicMaterial({ color: c });
    }, [color]);

    const geometry = useMemo(() => {
      switch (shapeType) {
        case "cylinder": {
          // Upright cylinder (barrel/drum)
          const radius = Math.min(w, d) / 2;
          return new THREE.CylinderGeometry(radius, radius, h, 16);
        }
        case "cylinder-side": {
          // Cylinder on its side (roll/tube)
          const radius = Math.min(h, d) / 2;
          const geo = new THREE.CylinderGeometry(radius, radius, w, 16);
          geo.rotateZ(Math.PI / 2);
          return geo;
        }
        case "bag": {
          // Rounded bag shape using sphere-ish geometry
          const geo = new THREE.SphereGeometry(1, 12, 8);
          geo.scale(w / 2, h / 2, d / 2);
          return geo;
        }
        case "flat-box": {
          // Flat pallet-like box
          return new THREE.BoxGeometry(w, h, d);
        }
        case "box":
        default: {
          return new THREE.BoxGeometry(w, h, d);
        }
      }
    }, [shapeType, w, h, d]);

    const edges = useMemo(() => {
      if (shapeType === "bag") return null;
      return new THREE.EdgesGeometry(geometry);
    }, [geometry, shapeType]);

    if (!visible) return null;

    return (
      <group position={position}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
        />
        {edges && <lineSegments geometry={edges} material={edgeMaterial} />}
      </group>
    );
  },
);

CargoMesh.displayName = "CargoMesh";

/* ═══════════════════════════════════════════════════════════
   Container Wireframe
   ═══════════════════════════════════════════════════════════ */

const ContainerWireframe: React.FC<{
  dims: { length: number; width: number; height: number };
}> = ({ dims }) => {
  const { length, width, height } = dims;

  const edges = useMemo(() => {
    const geo = new THREE.BoxGeometry(length, height, width);
    return new THREE.EdgesGeometry(geo);
  }, [length, width, height]);

  const lineMaterial = useMemo(() => {
    return new THREE.LineDashedMaterial({
      color: 0x96aac8,
      dashSize: 80,
      gapSize: 40,
      linewidth: 1,
      transparent: true,
      opacity: 0.5,
    });
  }, []);

  // Solid container floor — a real opaque slab at the bottom of the
  // container with a subtle dark frame so it reads as a real floor, not as
  // empty space. The floor is offset slightly below the box's bottom face
  // to avoid z-fighting with the (mostly transparent) wireframe walls.
  const floorMargin = 60; // mm — floor extends slightly past walls
  const floorThickness = 80; // mm — gives the floor real depth
  const floorEdges = useMemo(() => {
    const geo = new THREE.BoxGeometry(
      length + floorMargin * 2,
      floorThickness,
      width + floorMargin * 2
    );
    return new THREE.EdgesGeometry(geo);
  }, [length, width]);
  const floorEdgeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0x1f2937,
      linewidth: 2,
    });
  }, []);

  return (
    <group position={[length / 2, height / 2, 0]}>
      <lineSegments
        geometry={edges}
        material={lineMaterial}
        onUpdate={(self) => self.computeLineDistances()}
      />
      {/* Semi-transparent walls for depth perception */}
      <mesh>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial
          color={0xc8d7f0}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Solid opaque floor slab — a real 3D box (not a flat plane) so it
          looks like a physical floor from any camera angle. Positioned just
          below the container's bottom face. */}
      <mesh
        position={[0, -height / 2 - floorThickness / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry
          args={[
            length + floorMargin * 2,
            floorThickness,
            width + floorMargin * 2,
          ]}
        />
        <meshStandardMaterial
          color={0x8b6f47}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>
      {/* Dark frame around the floor for definition */}
      <lineSegments
        position={[0, -height / 2 - floorThickness / 2, 0]}
        geometry={floorEdges}
        material={floorEdgeMaterial}
      />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   Pallet Base — tiles real pallets across the container floor
   when Use Pallet is enabled and the API returns palletInfo.
   Falls back to a single full-floor slab.
   ═══════════════════════════════════════════════════════════ */

interface PalletBaseProps {
  containerDims: { length: number; width: number; height: number };
  palletDims?: { length: number; width: number; height: number };
  color?: string;
  palletType?: string;
  // Optional X/Z bounds (mm) of the cargo footprint. When provided, pallets
  // are tiled only under the cargo so every package sits on a pallet and we
  // don't draw empty pallets in unused parts of the container.
  cargoFootprint?: { minX: number; maxX: number; minZ: number; maxZ: number };
  // Set of "c,r" cell keys (anchored at container front-left corner with no
  // gap) that should actually be drawn. When provided, pallets at any other
  // (c,r) positions are skipped so unused floor space stays visually empty.
  usedPalletCells?: Set<string>;
}

// Derive a visual "style" from the pallet type string returned by the API.
// We don't change any backend contract — just inspect the type name to pick
// a render flavour (wood / plastic / metal / composite). Falls back to wood.
type PalletStyle = "wood" | "plastic" | "metal" | "composite";
const detectStyle = (type?: string): PalletStyle => {
  const t = (type || "").toLowerCase();
  if (t.includes("plastic")) return "plastic";
  if (t.includes("metal") || t.includes("steel") || t.includes("aluminum"))
    return "metal";
  if (t.includes("composite")) return "composite";
  return "wood";
};

// Per-style theme: default deck color, edge color, surface roughness/metalness.
// Used when the API color is missing or the schema's default `#000000`.
const STYLE_THEME: Record<
  PalletStyle,
  {
    deck: string;
    edge: string;
    roughness: number;
    metalness: number;
    showSlats: boolean;
  }
> = {
  wood: {
    deck: "#B07A3F",
    edge: "#5C3A1E",
    roughness: 0.9,
    metalness: 0.05,
    showSlats: true,
  },
  plastic: {
    deck: "#3B82F6",
    edge: "#1E3A8A",
    roughness: 0.35,
    metalness: 0.1,
    showSlats: false,
  },
  metal: {
    deck: "#9CA3AF",
    edge: "#4B5563",
    roughness: 0.4,
    metalness: 0.85,
    showSlats: false,
  },
  composite: {
    deck: "#A78B6F",
    edge: "#5C4731",
    roughness: 0.7,
    metalness: 0.15,
    showSlats: false,
  },
};

const PalletBase: React.FC<PalletBaseProps> = ({
  containerDims,
  palletDims,
  color,
  palletType,
  cargoFootprint,
  usedPalletCells,
}) => {
  const style = detectStyle(palletType);
  const theme = STYLE_THEME[style];
  // No specific pallet dimensions → single full-floor slab (legacy look)
  if (!palletDims) {
    const { length, width } = containerDims;
    const baseHeight = 60;
    return (
      <group position={[length / 2, -baseHeight / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, baseHeight, width]} />
          <meshStandardMaterial
            color={color || theme.deck}
            roughness={theme.roughness}
            metalness={theme.metalness}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry
            args={[new THREE.BoxGeometry(length, baseHeight, width)]}
          />
          <lineBasicMaterial color={theme.edge} />
        </lineSegments>
      </group>
    );
  }

  // Tile real pallets across the container floor.
  // Dimensions, color, and existence all come from the backend API
  // (data.palletInfo.pallet.{dimensions,color}).
  //
  // Resilience:
  //   • Pallet schema defaults color to '#000000' — many records ship with
  //     black. We override unset / black to a wood brown so users see a
  //     pallet, not a void.
  //   • Cap pallet height to a sane maximum so a malformed record doesn't
  //     swallow the whole container view.
  const isUsableColor =
    typeof color === "string" &&
    color.length > 0 &&
    color.toLowerCase() !== "#000000" &&
    color.toLowerCase() !== "#000";
  const deckColor = isUsableColor ? color : theme.deck;

  const pL = palletDims.length;
  const pW = palletDims.width;
  const rawH = palletDims.height || 144;
  // Real pallets are 100–200mm thick. Clamp visually for any malformed data.
  const pH = Math.min(Math.max(rawH, 80), 250);

  const GAP = Math.max(60, Math.min(pL, pW) * 0.08);
  // When cargoFootprint is provided, tile pallets so they fully cover the
  // cargo (every package sits on a pallet). The number of pallets per axis
  // is ceil(cargoSpan / palletDim). Gap between pallets is shrunk if needed
  // so the whole layout fits inside the container.
  const fpMinX = cargoFootprint?.minX ?? 0;
  const fpMaxX = cargoFootprint?.maxX ?? containerDims.length;
  const fpMinZ = cargoFootprint?.minZ ?? -containerDims.width / 2;
  const fpMaxZ = cargoFootprint?.maxZ ?? containerDims.width / 2;
  const cargoLenX = Math.max(pL, fpMaxX - fpMinX);
  const cargoLenZ = Math.max(pW, fpMaxZ - fpMinZ);

  // Hard cap on tiles per axis: never tile more pallets than physically fit
  // inside the container. Without this clamp a large cargo footprint could
  // produce a pallet block that overhangs the container walls/floor.
  const maxColsContainer = Math.max(1, Math.floor(containerDims.length / pL));
  const maxRowsContainer = Math.max(1, Math.floor(containerDims.width / pW));
  const cols = Math.max(
    1,
    Math.min(Math.ceil(cargoLenX / pL), maxColsContainer),
  );
  const rows = Math.max(
    1,
    Math.min(Math.ceil(cargoLenZ / pW), maxRowsContainer),
  );

  // Decide an actual gap that keeps the pallet block inside the container.
  // Cap at the desired GAP, but shrink to 0 if cargo is wide enough to need it.
  const maxGapX =
    cols > 1 ? (containerDims.length - cols * pL) / (cols - 1) : GAP;
  const maxGapZ =
    rows > 1 ? (containerDims.width - rows * pW) / (rows - 1) : GAP;
  const gapX = Math.max(0, Math.min(GAP, maxGapX));
  const gapZ = Math.max(0, Math.min(GAP, maxGapZ));

  const cellLDyn = pL + gapX;
  const cellWDyn = pW + gapZ;

  // Anchor the pallet block at the container's front-left corner so it
  // hugs the container's starting edge instead of floating in the middle.
  // The cargo placement loop also starts from this corner (x=0,
  // z=-width/2), so pallets and cargo end up aligned.
  const startX = 0;
  const startZ = -containerDims.width / 2;

  const edgeColor = theme.edge;

  const tiles: Array<{ x: number; z: number }> = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // Skip pallet cells with no cargo on top so unused container floor
      // stays visually empty instead of being draped in idle pallets.
      if (usedPalletCells && !usedPalletCells.has(`${c},${r}`)) continue;
      tiles.push({
        x: startX + c * cellLDyn + pL / 2,
        z: startZ + r * cellWDyn + pW / 2,
      });
    }
  }

  // Visual structure of each pallet:
  //   1. A thin flat deck slab — most of the visible thickness — in the
  //      brown wood color. Sits ON the floor, so cargo lands on top of it.
  //   2. Three short feet underneath at the front / middle / back so a
  //      hint of pallet structure shows through from a low camera angle,
  //      without dominating the view.
  //   3. Faint horizontal plank-seam lines on the top face for a wood look.
  const deckThk = pH * 0.55;
  const footH = pH - deckThk;
  const footThicknessZ = pW * 0.14;
  const footOffsetsZ = [
    -pW / 2 + footThicknessZ / 2,
    0,
    pW / 2 - footThicknessZ / 2,
  ];

  const PLANKS = 5;
  const plankInset = pW * 0.05;
  const plankSpacing = (pW - 2 * plankInset) / PLANKS;

  return (
    <group>
      {tiles.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          {/* Three short feet under the deck */}
          {footOffsetsZ.map((dz, j) => (
            <mesh
              key={`f${j}`}
              position={[0, footH / 2, dz]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[pL, footH, footThicknessZ]} />
              <meshStandardMaterial
                color={deckColor}
                roughness={theme.roughness}
                metalness={theme.metalness}
              />
            </mesh>
          ))}

          {/* Top deck slab */}
          <mesh
            position={[0, footH + deckThk / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[pL, deckThk, pW]} />
            <meshStandardMaterial
              color={deckColor}
              roughness={theme.roughness}
              metalness={theme.metalness}
            />
          </mesh>
          <lineSegments position={[0, footH + deckThk / 2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(pL, deckThk, pW)]} />
            <lineBasicMaterial color={edgeColor} />
          </lineSegments>

          {/* Plank seams — only on wooden pallets */}
          {theme.showSlats &&
            Array.from({ length: PLANKS - 1 }).map((_, k) => {
              const z = -pW / 2 + plankInset + (k + 1) * plankSpacing;
              return (
                <mesh
                  key={`pl${k}`}
                  position={[0, pH + 0.5, z]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[pL * 0.96, 4]} />
                  <meshBasicMaterial
                    color={edgeColor}
                    transparent
                    opacity={0.4}
                  />
                </mesh>
              );
            })}

          {/* Metal pallets: subtle cross-brace pattern on the deck */}
          {style === "metal" &&
            [-pW / 4, pW / 4].map((zOff, k) => (
              <mesh
                key={`mb${k}`}
                position={[0, pH + 0.5, zOff]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[pL * 0.96, pW * 0.04]} />
                <meshBasicMaterial color={edgeColor} transparent opacity={0.5} />
              </mesh>
            ))}

          {/* Plastic pallets: a couple of inset rectangles to suggest molded ribs */}
          {style === "plastic" && (
            <>
              <mesh
                position={[0, pH + 0.5, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[pL * 0.85, pW * 0.65]} />
                <meshBasicMaterial
                  color={edgeColor}
                  transparent
                  opacity={0.18}
                />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   Progressive Loading Manager
   ═══════════════════════════════════════════════════════════ */

const ProgressiveCargoLoader: React.FC<{
  cargoBoxes: Array<{
    position: [number, number, number];
    size: [number, number, number];
    color: string;
    shapeType: CargoShapeType;
  }>;
  onLoadingProgress: (loaded: number, total: number) => void;
}> = ({ cargoBoxes, onLoadingProgress }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const frameCounter = useRef(0);

  useEffect(() => {
    setVisibleCount(0);
    frameCounter.current = 0;
  }, [cargoBoxes]);

  useFrame(() => {
    if (visibleCount >= cargoBoxes.length) return;
    frameCounter.current++;
    if (frameCounter.current % 2 === 0) {
      const batchSize = Math.max(1, Math.ceil(cargoBoxes.length / 60));
      const next = Math.min(visibleCount + batchSize, cargoBoxes.length);
      setVisibleCount(next);
      onLoadingProgress(next, cargoBoxes.length);
    }
  });

  return (
    <>
      {cargoBoxes.map((box, idx) => (
        <CargoMesh
          key={idx}
          position={box.position}
          size={box.size}
          color={box.color}
          shapeType={box.shapeType}
          visible={idx < visibleCount}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Container3DScene Component
   ═══════════════════════════════════════════════════════════ */

const Container3DScene: React.FC<Container3DSceneProps> = ({
  cargoItems,
  containerSize = "20ft",
  palletInfo,
}) => {
  const [loadingState, setLoadingState] = useState({ loaded: 0, total: 0 });
  const isLoading = loadingState.loaded < loadingState.total;

  const dims = CONTAINER_DIMS[containerSize] || CONTAINER_DIMS["20ft"];

  // When the user opted in to pallets and the API returned valid pallet
  // dimensions, lift cargo up so it sits ON TOP of the pallets, not inside
  // the container floor. We clamp the height to the same range PalletBase
  // uses so cargo lands flush with the rendered deck.
  const palletEnabled = palletInfo?.used === true && !!palletInfo?.pallet;
  const palletDeckHeight = palletEnabled
    ? Math.min(
        Math.max(palletInfo!.pallet!.dimensions?.height || 144, 80),
        250,
      )
    : 0;

  // Pallet block geometry — anchored at the container's front-left corner,
  // sized to the maximum number of pallet footprints that physically fit.
  // Cargo placement is then restricted to this rectangle so every package
  // sits ON a pallet (instead of spilling onto the bare floor or over the
  // pallet edge). PalletBase consumes the same block so the two stay aligned.
  const palletBlock = useMemo(() => {
    if (!palletEnabled || !palletInfo?.pallet?.dimensions) return null;
    const pL = palletInfo.pallet.dimensions.length;
    const pW = palletInfo.pallet.dimensions.width;
    if (!pL || !pW) return null;
    const cols = Math.max(1, Math.floor(dims.length / pL));
    const rows = Math.max(1, Math.floor(dims.width / pW));
    const totalL = cols * pL;
    const totalW = rows * pW;
    const startX = 0;
    const startZ = -dims.width / 2;
    return {
      pL,
      pW,
      cols,
      rows,
      totalL,
      totalW,
      startX,
      startZ,
      // Cargo placement bounds (front-left corner anchored)
      boundsMinX: startX,
      boundsMaxX: startX + totalL,
      boundsMinZ: startZ,
      boundsMaxZ: startZ + totalW,
    };
  }, [palletEnabled, palletInfo, dims]);

  // Build cargo placement positions
  const cargoBoxes = useMemo(() => {
    const boxes: Array<{
      position: [number, number, number];
      size: [number, number, number];
      color: string;
      shapeType: CargoShapeType;
    }> = [];

    const totalAllPackages = cargoItems.reduce((s, i) => s + i.packages, 0);
    if (totalAllPackages === 0) return boxes;

    const itemSpecs = cargoItems.map((item) => {
      let bL: number, bW: number, bH: number;
      if (item.lengthMm && item.widthMm && item.heightMm) {
        bL = item.lengthMm;
        bW = item.widthMm;
        bH = item.heightMm;
      } else if (item.packages > 0 && item.volume > 0) {
        const volPerPkg = (item.volume / item.packages) * 1e9; // m³ → mm³
        const side = Math.cbrt(volPerPkg);
        bL = side;
        bW = side;
        bH = side;
      } else {
        bL = 500;
        bW = 500;
        bH = 500;
      }

      const shapeType = getShapeType(item.cargoType);

      // For flat-box (pallet), ensure it's flat
      if (shapeType === "flat-box") {
        bH = Math.min(bH, Math.max(bL, bW) * 0.2);
      }

      return { item, bL, bW, bH, shapeType };
    });

    // Stable load order: boxes/bags (flat, stackable) on the bottom, then
    // bulk-shaped items, then cylindrical items (barrels, rolls, pipes) on
    // top. Mirrors how warehouse crews actually pack containers — heavy/flat
    // first, round-on-top — and prevents cylinders from being pinned under
    // boxes which have no curvature to register against.
    const SHAPE_ORDER: Record<CargoShapeType, number> = {
      "flat-box": 0, // pallet-style — should sit on the floor
      box: 1,
      bag: 2,
      sphere: 3,
      cylinder: 4,
      "cylinder-side": 4,
    };
    itemSpecs.sort(
      (a, b) =>
        (SHAPE_ORDER[a.shapeType] ?? 5) - (SHAPE_ORDER[b.shapeType] ?? 5),
    );

    // When pallets are enabled, cargo can only sit on the pallet block area
    // (front-left corner of the container). Use that rectangle as the
    // available footprint instead of the full container floor.
    const floorLen = palletBlock ? palletBlock.totalL : dims.length;
    const floorWid = palletBlock ? palletBlock.totalW : dims.width;
    const floorOriginX = palletBlock ? palletBlock.startX : 0;
    const floorOriginZ = palletBlock ? palletBlock.startZ : -dims.width / 2;

    // Pick (cols, rows, layers) for `n` items.
    // Strategy: use the FULL available footprint (maxCols × maxRows) so the
    // cargo block is as wide as the container floor (or pallet block) allows,
    // then add only as many layers as required. This keeps each cargo type
    // visually flush with the container walls. A partial last layer is
    // tolerated — when the next cargo type stacks on top, its placement
    // is also driven by the same wide footprint, so the side-walls of the
    // cargo stack stay aligned.
    const findOptimalLayout = (
      n: number,
      maxCols: number,
      maxRows: number,
      maxLayers: number,
    ) => {
      const cap = maxCols * maxRows;
      const layers = Math.min(
        maxLayers,
        Math.max(1, Math.ceil(n / cap)),
      );
      return {
        cols: maxCols,
        rows: maxRows,
        layers,
        waste: cap * layers - n,
      };
    };

    // Check capacity at a given scale.
    // The placement loop stacks cargo types vertically (each type starts where
    // the previous left off via `globalYUsed`), so capacity must mirror that.
    // If we used full container height per item, the binary search would pick
    // a scale that's too large and the second type would render above the
    // container ceiling.
    const capacityAtScale = (s: number) => {
      let cap = 0;
      let yUsed = palletDeckHeight;
      // Each subsequent cargo type's footprint is capped at the previous
      // type's actual extent so a top type can't overhang past the type
      // beneath it (which would render as cargo "floating in air").
      let extentX = floorLen;
      let extentZ = floorWid;
      for (const { item, bL, bW, bH } of itemSpecs) {
        if (item.packages <= 0) continue;
        const pw = bL * s;
        const pd = bW * s;
        const ph = bH * s;
        if (pw < 1 || pd < 1 || ph < 1) continue;
        const maxCols = Math.max(1, Math.floor(extentX / pw));
        const maxRows = Math.max(1, Math.floor(extentZ / pd));
        const availH = dims.height - yUsed;
        const maxLayers = Math.floor(availH / ph);
        if (maxLayers <= 0) continue;
        const layout = findOptimalLayout(
          item.packages,
          maxCols,
          maxRows,
          maxLayers,
        );
        const placed = Math.min(
          item.packages,
          layout.cols * layout.rows * layout.layers,
        );
        cap += placed;
        yUsed += layout.layers * ph;
        // Shrink extent to this type's actual extent so the next type
        // (stacked above) can't extend past where this one ends.
        extentX = Math.min(extentX, layout.cols * pw);
        extentZ = Math.min(extentZ, layout.rows * pd);
      }
      return cap;
    };

    // Binary search for scale that fits all packages
    const findScale = (lo: number, hi: number) => {
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (capacityAtScale(mid) >= totalAllPackages) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    const capAtOne = capacityAtScale(1.0);
    let vScale: number;
    if (capAtOne >= totalAllPackages) {
      vScale = 1.0;
    } else {
      vScale = findScale(0.01, 1.0);
    }

    // Place items group by group, stacking vertically.
    // When pallets are used, start cargo at the pallet deck height so cargo
    // sits ON the pallet rather than inside the container floor.
    let globalYUsed = palletDeckHeight;
    // Track the running cargo footprint extent. Each successive type can
    // only spread out as wide as the type immediately below it, so a top
    // type never overhangs past the bottom block (which would visually
    // float in the air with no cargo underneath).
    let extentX = floorLen;
    let extentZ = floorWid;

    for (const { item, bL, bW, bH, shapeType } of itemSpecs) {
      if (item.packages <= 0) continue;

      const pw = bL * vScale;
      const pd = bW * vScale;
      const ph = bH * vScale;

      const maxColsAvail = Math.max(1, Math.floor(extentX / pw));
      const maxRowsAvail = Math.max(1, Math.floor(extentZ / pd));
      const availableH = dims.height - globalYUsed;
      const maxStackLayers = Math.floor(availableH / ph);

      // No vertical room left for this cargo type — skip it instead of
      // forcing one layer that would render above the container ceiling.
      if (maxStackLayers <= 0) continue;

      // Use the same waste-minimising layout the capacity check picked, so
      // every layer is fully filled. This avoids partial top layers, which
      // would otherwise leave hollow vertical strips that the next cargo
      // type renders over (visible as gaps in the 3D view).
      const layout = findOptimalLayout(
        item.packages,
        maxColsAvail,
        maxRowsAvail,
        maxStackLayers,
      );
      const colsAlong = layout.cols;
      const depthLayers = layout.rows;
      const stackLayers = layout.layers;

      let placed = 0;
      let maxSy = 0;

      for (let sy = 0; sy < stackLayers && placed < item.packages; sy++) {
        for (let sz = 0; sz < depthLayers && placed < item.packages; sz++) {
          for (let sx = 0; sx < colsAlong && placed < item.packages; sx++) {
            // Position in mm. When pallets are enabled, origin is the front-
            // left corner of the pallet block (which is the same as the
            // container's front-left corner). Without pallets, fall back to
            // the container's front-left corner directly.
            const x = floorOriginX + sx * pw + pw / 2;
            const y = globalYUsed + sy * ph + ph / 2;
            const z = floorOriginZ + sz * pd + pd / 2;

            boxes.push({
              position: [x, y, z],
              size: [pw, ph, pd],
              color: item.color,
              shapeType,
            });
            placed++;
            maxSy = Math.max(maxSy, sy + 1);
          }
        }
      }

      globalYUsed += maxSy * ph;
      // Shrink the running extent so anything stacked above this type can't
      // spread out past where this type actually ends.
      extentX = Math.min(extentX, colsAlong * pw);
      extentZ = Math.min(extentZ, depthLayers * pd);
    }

    return boxes;
  }, [cargoItems, dims, palletDeckHeight, palletBlock]);

  // Bounding box of the cargo on the X/Z plane — used to constrain pallet
  // tiling to "only under the cargo" so every package sits on a pallet.
  const cargoFootprint = useMemo(() => {
    if (!palletEnabled || cargoBoxes.length === 0) return undefined;
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const b of cargoBoxes) {
      const [x, , z] = b.position;
      const [w, , d] = b.size;
      minX = Math.min(minX, x - w / 2);
      maxX = Math.max(maxX, x + w / 2);
      minZ = Math.min(minZ, z - d / 2);
      maxZ = Math.max(maxZ, z + d / 2);
    }
    return { minX, maxX, minZ, maxZ };
  }, [cargoBoxes, palletEnabled]);

  // Set of "c,r" pallet cell keys that have at least one cargo box sitting on
  // them. Used to skip rendering empty pallets so that when cargo only fills
  // part of the floor, the unused cells are left empty (not draped in pallets).
  const usedPalletCells = useMemo<Set<string> | undefined>(() => {
    if (!palletBlock || cargoBoxes.length === 0) return undefined;
    const used = new Set<string>();
    const { pL, pW, cols, rows, startX, startZ } = palletBlock;
    for (const b of cargoBoxes) {
      const [x, , z] = b.position;
      const c = Math.min(cols - 1, Math.max(0, Math.floor((x - startX) / pL)));
      const r = Math.min(rows - 1, Math.max(0, Math.floor((z - startZ) / pW)));
      used.add(`${c},${r}`);
    }
    return used;
  }, [palletBlock, cargoBoxes]);

  const handleLoadingProgress = useCallback((loaded: number, total: number) => {
    setLoadingState({ loaded, total });
  }, []);

  // Reset loading when cargo changes
  useEffect(() => {
    setLoadingState({ loaded: 0, total: cargoBoxes.length });
  }, [cargoBoxes.length]);

  // Camera position based on container size
  const cameraPosition = useMemo<[number, number, number]>(() => {
    const dist = containerSize === "40ft" ? 14000 : 8000;
    return [dims.length * 0.6, dims.height * 1.2, dist];
  }, [containerSize, dims]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl select-none"
      style={{ height: 320, background: "#f5f6f8" }}
    >
      {/* Loading progress badge */}
      <div className="absolute bottom-2 left-3 z-10 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-700 backdrop-blur-sm pointer-events-none select-none">
        {isLoading ? (
          <>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Loading {loadingState.loaded} / {loadingState.total} items...
          </>
        ) : (
          <>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            {cargoBoxes.length} items loaded
          </>
        )}
      </div>

      {/* Shape legend */}
      <div className="absolute top-2 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none select-none">
        {cargoItems
          .filter((i) => i.packages > 0)
          .map((item) => {
            const shape = getShapeType(item.cargoType);
            const shapeLabel =
              shape === "cylinder"
                ? "(Barrel)"
                : shape === "cylinder-side"
                  ? "(Roll)"
                  : shape === "bag"
                    ? "(Bag)"
                    : shape === "flat-box"
                      ? "(Pallet)"
                      : "(Box)";
            return (
              <span
                key={item.name}
                className="flex items-center gap-1 rounded-md border border-gray-200 bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 backdrop-blur-sm"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.icon} {item.name} {shapeLabel}
              </span>
            );
          })}
      </div>

      <Canvas
        camera={{ position: cameraPosition, fov: 45, near: 10, far: 50000 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[dims.length, dims.height * 2, dims.width]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-dims.length, dims.height, -dims.width]}
          intensity={0.3}
        />

        {/* Container wireframe */}
        <ContainerWireframe dims={dims} />

        {/* Pallet base — only shown when Use Pallet is enabled.
            Pallets are tiled only under the cargo footprint so every
            package sits on a pallet. */}
        {palletEnabled && (
          <PalletBase
            containerDims={dims}
            palletDims={palletInfo!.pallet!.dimensions}
            color={palletInfo!.pallet!.color}
            palletType={palletInfo!.pallet!.type}
            cargoFootprint={cargoFootprint}
            usedPalletCells={usedPalletCells}
          />
        )}

        {/* Cargo items with progressive loading */}
        <ProgressiveCargoLoader
          cargoBoxes={cargoBoxes}
          onLoadingProgress={handleLoadingProgress}
        />

        {/* Orbit controls */}
        <OrbitControls
          target={[dims.length / 2, dims.height / 3, 0]}
          enablePan
          enableZoom
          enableRotate
          minDistance={1000}
          maxDistance={30000}
          maxPolarAngle={Math.PI * 0.85}
        />

        <Environment preset="warehouse" />
      </Canvas>

      {/* 3D View label */}
      <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-500 shadow-sm pointer-events-none select-none">
        3D View
      </div>
    </div>
  );
};

export default Container3DScene;

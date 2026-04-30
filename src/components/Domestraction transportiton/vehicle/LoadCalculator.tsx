import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Settings,
  FileDown,
  FileUp,
  X,
  Loader2,
} from "lucide-react";
import CargoDesignModal, { type CargoFormSubmission } from "./CargoDesignModal";
import ContainerSelectionModal, {
  CONTAINER_SPEC_OPTIONS,
  Container3D,
} from "./ContainerSelectionModal";
import StuffingResultPage from "./StuffingResultPage";
import {
  useCalculateMultipleContainersMinimalMutation,
  useGetCargoTypesQuery,
  useGetEnhanced3DVisualizationMutation,
  useGetPalletTypesQuery,
  useGetPalletsByTypeQuery,
  type CargoTypeSpec,
  type SpacingSettings,
  type StuffingSettings,
} from "@/services/transportApi";
import type { CalculateMultipleContainersMinimalResponse } from "./types";

interface LoadCalculatorProps {
  onNavigateToContainer?: (containerId: string) => void;
}

interface ProductRow {
  id: string;
  type: string;
  productName: string;
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  quantity: string;
  quantityUnit: string;
  color: string;
  stack: string;
  lengthAccuracy: string;
  rollPlacement: RollPlacement;
  // Per-product spacing/stuffing captured by the CargoDesignModal popup.
  // Forwarded into POST /load-calculator/api/calculate-multiple-containers.
  spacingSettings?: SpacingSettings;
  stuffingSettings?: StuffingSettings;
}

type RollPlacement = "square" | "hexagon";

// Map legacy UI cargo ids to backend API cargo keys returned by
// GET /load-calculator/api/cargo-types
const UI_TO_API_CARGO: Record<string, string> = {
  "big-box": "box",
  "big-bag": "bigbags",
  bag: "bigbags",
  sack: "sacks",
  drum: "barrels",
  barrel: "barrels",
  cylinder: "barrels",
  tube: "pipes",
  ibc: "barrels",
  container: "box",
  crate: "box",
  bundle: "box",
  carton: "box",
  pallet: "box",
};

// Used while the cargo-types API request is loading or fails
const FALLBACK_CARGO_TYPES = [
  { id: "box", label: "Box", icon: "📦" },
  { id: "bigbags", label: "Big Bags", icon: "🛍️" },
  { id: "sacks", label: "Sacks", icon: "🛍️" },
  { id: "barrels", label: "Barrels", icon: "🛢️" },
  { id: "roll", label: "Roll", icon: "🗞️" },
  { id: "pipes", label: "Pipes", icon: "🔧" },
  { id: "bulk", label: "Bulk", icon: "⛰️" },
];

// API cargo keys that are cylindrical — used as fallback when the
// cargo-types API has not loaded yet (so width column collapses correctly
// on the very first render before the network roundtrip).
const CYLINDRICAL_API_KEYS = new Set(["barrels", "roll", "pipes"]);

const LoadCalculator = ({ onNavigateToContainer }: LoadCalculatorProps) => {
  const [activeTab, setActiveTab] = useState<
    "product" | "containers" | "stuffing"
  >("product");
  const [products, setProducts] = useState<ProductRow[]>([]);

  const addProductFromModal = (data: CargoFormSubmission) => {
    // Edit mode: replace the row whose ID is in editingProductId. Type is
    // locked while editing so the row's original ID and unit settings are
    // preserved; only the cargo measurements + spacing/stuffing change.
    if (editingProductId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                type: data.type || p.type,
                productName: data.productName || p.productName,
                length: data.length || "",
                width: data.width || "",
                height: data.height || "",
                weight: data.weight || "",
                quantity: data.quantity || "1",
                color: data.colour || p.color,
                spacingSettings: data.spacingSettings,
                stuffingSettings: data.stuffingSettings,
              }
            : p,
        ),
      );
      setEditingProductId(null);
      return;
    }

    const newProduct: ProductRow = {
      id: Date.now().toString(),
      type: data.type || "box",
      productName: data.productName || "New Product",
      length: data.length || "",
      lengthUnit: "mm",
      width: data.width || "",
      widthUnit: "mm",
      height: data.height || "",
      heightUnit: "mm",
      weight: data.weight || "",
      weightUnit: "kg",
      quantity: data.quantity || "1",
      quantityUnit: "mm",
      color: data.colour || "#3b82f6",
      stack: "",
      lengthAccuracy: "5",
      rollPlacement: "square",
      spacingSettings: data.spacingSettings,
      stuffingSettings: data.stuffingSettings,
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  const [openPopover, setOpenPopover] = useState<
    "add-group" | "import" | "export" | "upgrade" | null
  >(null);
  const actionAreaRef = useRef<HTMLDivElement | null>(null);
  const [isColorSettingsOpen, setIsColorSettingsOpen] = useState(false);
  const [isCargoDesignOpen, setIsCargoDesignOpen] = useState(false);
  // ID of the product row currently being edited via CargoDesignModal.
  // null → modal is in "add new product" mode.
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Build a CargoFormSubmission from a ProductRow, used to prefill the modal
  // when the user clicks the gear icon to edit an existing row.
  const buildInitialDataForRow = (
    p: ProductRow,
  ): CargoFormSubmission => ({
    type: p.type,
    productName: p.productName,
    colour: p.color,
    length: p.length,
    width: p.width,
    height: p.height,
    weight: p.weight,
    quantity: p.quantity,
    spacingSettings: p.spacingSettings,
    stuffingSettings: p.stuffingSettings,
  });

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId) ?? null
    : null;

  const [isContainerSelectionOpen, setIsContainerSelectionOpen] =
    useState(false);
  const [showTruckComingSoon, setShowTruckComingSoon] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [automaticContainerSelection, setAutomaticContainerSelection] =
    useState(true);
  const [containers, setContainers] = useState<
    {
      id: number;
      type: string;
      name: string;
      size: "20ft" | "40ft";
      dimensions: string;
      capacity: string;
      maxWeight: string;
    }[]
  >([]);
  const [showStuffingResult, setShowStuffingResult] = useState(false);
  const [stuffingData, setStuffingData] = useState<any>(null);
  const [_apiResponseData, setApiResponseData] =
    useState<CalculateMultipleContainersMinimalResponse | null>(null);
  // Server-computed 3D scene from POST /load-calculator/api/enhanced-3d-visualization
  const [enhanced3D, setEnhanced3D] = useState<unknown>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [calculateMultipleContainers, { isLoading: isCalculating }] =
    useCalculateMultipleContainersMinimalMutation();
  const [fetchEnhanced3D] = useGetEnhanced3DVisualizationMutation();

  // Fetch cargo type catalog from backend — drives the Type dropdown and
  // tells us which types are cylindrical (only need diameter + height).
  const { data: cargoTypesResp } = useGetCargoTypesQuery();
  const apiCargoTypes = cargoTypesResp?.data;

  const toApiCargoKey = (uiTypeId: string): string =>
    UI_TO_API_CARGO[uiTypeId] ?? uiTypeId;

  const getCargoSpec = (uiTypeId: string): CargoTypeSpec | undefined => {
    if (!apiCargoTypes) return undefined;
    return apiCargoTypes[toApiCargoKey(uiTypeId)];
  };

  const isCylindrical = (uiTypeId: string): boolean => {
    const spec = getCargoSpec(uiTypeId);
    if (spec) return spec.cylindrical === true;
    // Fallback when cargo-types API hasn't resolved (e.g. CORS / 401):
    // we still want the width column to collapse for known cylindrical types.
    return CYLINDRICAL_API_KEYS.has(toApiCargoKey(uiTypeId));
  };

  const cargoTypeOptions = apiCargoTypes
    ? Object.entries(apiCargoTypes).map(([id, spec]) => ({
        id,
        label: spec.name,
        icon: spec.icon || "📦",
      }))
    : FALLBACK_CARGO_TYPES;

  // Use Pallet toggle — feeds usePallets / palletType into the calc request
  const [usePallets, setUsePallets] = useState(false);
  const [palletType, setPalletType] = useState<string>(""); // "" = auto-select
  const { data: palletTypesResp } = useGetPalletTypesQuery(undefined, {
    skip: !usePallets, // only fetch when the user opts in
  });
  const palletTypeOptions = palletTypesResp?.data ?? [];

  // When the user picks a specific pallet type from the dropdown, fetch
  // its full record (dimensions, max weight, color, material) so we can
  // render the spec inline. Skipped on Auto.
  const { data: palletDetailsResp, isFetching: palletDetailsLoading } =
    useGetPalletsByTypeQuery(palletType, {
      skip: !usePallets || !palletType,
    });
  const selectedPalletSpec = palletDetailsResp?.data?.pallets?.[0];
  const [settingsForm, setSettingsForm] = useState({
    lengthUnit: "mm",
    massUnit: "kg",
    lengthAccuracy: "5",
    rollPlacement: "square" as RollPlacement,
  });

  const LENGTH_UNITS = [
    { label: "Millimeters", value: "mm" },
    { label: "Centimeters", value: "cm" },
    { label: "Meters", value: "m" },
  ];

  const MASS_UNITS = [
    { label: "Kilograms", value: "kg" },
    { label: "Grams", value: "g" },
    { label: "Pounds", value: "lb" },
  ];

  const LENGTH_ACCURACIES = ["1", "2", "5", "10"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openPopover &&
        actionAreaRef.current &&
        !actionAreaRef.current.contains(event.target as Node)
      ) {
        setOpenPopover(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopover]);

  const popoverContent = {
    "add-group": {
      title: "Plan",
      badge: "Free",
      used: "3 / 3",
      message: "You have reached the limit. Please purchase additional credits",
    },
    import: {
      title: "Import Limit",
      badge: "Free",
      used: "3 / 3",
      message: "Upgrade your plan to unlock bulk import for more products",
    },
    export: {
      title: "Export Limit",
      badge: "Free",
      used: "3 / 3",
      message:
        "You have reached the export quota. Upgrade to continue exporting",
    },
    upgrade: {
      title: "Plan",
      badge: "Free",
      used: "3 / 3",
      message: "Unlock premium features and increase your usage limits",
    },
  } as const;

  const togglePopover = (
    action: "add-group" | "import" | "export" | "upgrade",
  ) => {
    setOpenPopover((prev) => (prev === action ? null : action));
  };

  const openColorSettings = (product: ProductRow) => {
    setSelectedProductId(product.id);
    setSettingsForm({
      lengthUnit: product.lengthUnit || "mm",
      massUnit: product.weightUnit || "kg",
      lengthAccuracy: product.lengthAccuracy || "5",
      rollPlacement: product.rollPlacement || "square",
    });
    setIsColorSettingsOpen(true);
  };

  const closeColorSettings = () => {
    setIsColorSettingsOpen(false);
    setSelectedProductId(null);
  };

  const _handleSaveSettings = () => {
    if (!selectedProductId) {
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === selectedProductId
          ? {
              ...product,
              lengthUnit: settingsForm.lengthUnit,
              weightUnit: settingsForm.massUnit,
              lengthAccuracy: settingsForm.lengthAccuracy,
              rollPlacement: settingsForm.rollPlacement,
              stack:
                settingsForm.rollPlacement === "square" ? "Square" : "Hexagon",
            }
          : product,
      ),
    );

    closeColorSettings();
  };

  // Helper function to get icon for cargo type
  const getIconForType = (type: string): string => {
    const iconMap: Record<string, string> = {
      box: "📦",
      bag: "💼",
      sack: "🎒",
      container: "📦",
      drum: "🛢️",
      pallet: "📋",
    };
    return iconMap[type] || "📦";
  };

  // Helper function to calculate volume
  const calculateVolume = (product: ProductRow): number => {
    const length = parseFloat(product.length) || 0;
    const width = parseFloat(product.width) || 0;
    const height = parseFloat(product.height) || 0;
    const quantity = parseInt(product.quantity) || 0;

    // Convert to m³ (assuming mm input)
    return (length * width * height * quantity) / 1000000000;
  };

  // Convert mm to other units helper
  const convertToMm = (value: number, unit: string): number => {
    switch (unit) {
      case "cm":
        return value * 10;
      case "m":
        return value * 1000;
      default:
        return value; // mm
    }
  };

  // Handler to show stuffing results - calls real backend API
  const handleShowStuffingResults = async () => {
    setApiError(null);

    // Validate products have required fields
    const validProducts = products.filter((p) => {
      const cyl = isCylindrical(p.type);
      return (
        parseFloat(p.length) > 0 &&
        (cyl || parseFloat(p.width) > 0) &&
        parseFloat(p.height) > 0 &&
        parseFloat(p.weight) > 0 &&
        parseInt(p.quantity) > 0
      );
    });

    if (validProducts.length === 0) {
      setApiError(
        "Please fill in dimensions, weight, and quantity for at least one product.",
      );
      setActiveTab("stuffing");
      return;
    }

    // Build API request products
    const apiProducts = validProducts.map((product) => {
      const cyl = isCylindrical(product.type);
      const lengthMm = convertToMm(
        parseFloat(product.length),
        product.lengthUnit,
      );
      // For cylindrical cargo, the calc endpoint still expects a width.
      // Treat the diameter (length input) as both length and width so the
      // bounding box matches the cylinder's footprint.
      const widthMm = cyl
        ? lengthMm
        : convertToMm(parseFloat(product.width), product.widthUnit);
      return {
        name: product.productName,
        length: lengthMm,
        width: widthMm,
        height: convertToMm(parseFloat(product.height), product.heightUnit),
        weight: parseFloat(product.weight),
        quantity: parseInt(product.quantity),
        cargoType: toApiCargoKey(product.type),
        color: product.color,
        // Forward the per-product spacing/stuffing settings collected by the
        // CargoDesignModal popup. Drop empty objects so the backend falls
        // back to its own defaults rather than receiving `{}`.
        ...(product.spacingSettings &&
          Object.keys(product.spacingSettings).length > 0 && {
            spacingSettings: product.spacingSettings,
          }),
        ...(product.stuffingSettings &&
          Object.keys(product.stuffingSettings).length > 0 && {
            stuffingSettings: product.stuffingSettings,
          }),
      };
    });

    // Determine the selected container type for the API
    const selectedContainerSize =
      containers.length > 0 ? containers[0].size : "20ft";
    const preferredContainerType =
      selectedContainerSize === "40ft" ? "40ft_standard" : "20ft_standard";

    try {
      const result = await calculateMultipleContainers({
        products: apiProducts,
        preferences: {
          preferredContainerType,
        },
        usePallets,
        palletType: usePallets ? palletType || null : null,
        format: "minimal",
      }).unwrap();

      if (result.success && result.data) {
        const data = result.data;
        setApiResponseData(data);

        // Fire the dedicated 3D visualization endpoint in parallel with the
        // rest of the post-calc work so the 3D scene can switch from
        // client-computed positions to authoritative server positions when
        // the response arrives. Failures are non-fatal.
        fetchEnhanced3D({
          products: apiProducts,
          preferences: { preferredContainerType },
          containerIndex: 0,
        })
          .unwrap()
          .then((resp) => {
            if (resp?.success && resp.data) setEnhanced3D(resp.data);
          })
          .catch(() => {
            setEnhanced3D(null);
          });

        // Also build local stuffingData for the StuffingResultPage component
        const cargoItems = validProducts.map((product) => {
          const cyl = isCylindrical(product.type);
          const lengthMm = convertToMm(
            parseFloat(product.length),
            product.lengthUnit,
          );
          const widthMm = cyl
            ? lengthMm
            : convertToMm(parseFloat(product.width), product.widthUnit);
          return {
            name: product.productName,
            packages: parseInt(product.quantity) || 0,
            volume: calculateVolume(product),
            weight: parseFloat(product.weight) || 0,
            color: product.color,
            icon: getIconForType(product.type),
            cargoType: product.type,
            lengthMm,
            widthMm,
            heightMm: convertToMm(parseFloat(product.height), product.heightUnit),
          };
        });

        const totalPackages = cargoItems.reduce(
          (sum, item) => sum + item.packages,
          0,
        );
        const totalVolume = cargoItems.reduce(
          (sum, item) => sum + item.volume,
          0,
        );
        const totalWeight = cargoItems.reduce(
          (sum, item) => sum + item.weight,
          0,
        );

        // Extract info from API response
        const firstContainer = data.containers?.[0];
        const containerTypeName =
          firstContainer?.containerType || data.containerType || "20' Standard";

        // Parse utilization from API response
        const volumeMatch =
          firstContainer?.utilization?.cargoVolume?.match(/([\d.]+)%/);
        const weightMatch =
          firstContainer?.utilization?.cargoWeight?.match(/([\d.]+)%/);
        const volumePercentage = volumeMatch ? parseInt(volumeMatch[1]) : 0;
        const weightPercentage = weightMatch ? parseInt(weightMatch[1]) : 0;

        // Parse max values from remaining + used
        const cargoVolumeStr = firstContainer?.utilization?.cargoVolume || "";
        const remainingVolumeStr =
          firstContainer?.utilization?.remainingVolume || "";
        const usedVolume = parseFloat(
          cargoVolumeStr.match(/([\d.]+)\s*m/)?.[1] || "0",
        );
        const remainingVolume = parseFloat(
          remainingVolumeStr.match(/([\d.]+)/)?.[1] || "0",
        );
        const containerMaxVolume = usedVolume + remainingVolume || 33.2;

        const cargoWeightStr = firstContainer?.utilization?.cargoWeight || "";
        const remainingWeightStr =
          firstContainer?.utilization?.remainingWeight || "";
        const usedWeight = parseFloat(
          cargoWeightStr.match(/([\d.]+)\s*kg/)?.[1] || "0",
        );
        const remainingWeight = parseFloat(
          remainingWeightStr.match(/([\d.]+)/)?.[1] || "0",
        );
        const containerMaxWeight = usedWeight + remainingWeight || 28200;

        // Use the first selected container's name, or fall back to API/default
        const selectedContainerName =
          containers.length > 0 ? containers[0].name : containerTypeName;

        setStuffingData({
          containerType: selectedContainerName,
          containerName: `${selectedContainerName} #1`,
          containerSize: selectedContainerSize,
          cargoItems,
          totalPackages,
          cargoVolume: usedVolume || totalVolume,
          cargoWeight: usedWeight || totalWeight,
          volumePercentage,
          weightPercentage,
          maxWeight: containerMaxWeight,
          totalVolume: containerMaxVolume,
          // Pass full API response for detailed display
          apiResponse: data,
        });

        setShowStuffingResult(true);
        setActiveTab("stuffing");
      } else {
        setApiError(
          result.message ||
            "Calculation failed. Please check your product data.",
        );
        setActiveTab("stuffing");
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message ||
            "API request failed"
          : "Failed to connect to calculation service. Please try again.";
      setApiError(errorMsg);
      setActiveTab("stuffing");
    }
  };

  const handleCloseStuffingResults = () => {
    setShowStuffingResult(false);
    setStuffingData(null);
    setApiResponseData(null);
    setEnhanced3D(null);
    setApiError(null);
    setActiveTab("product");
  };

  const renderPopover = (
    action: "add-group" | "import" | "export" | "upgrade",
  ) => {
    const content = popoverContent[action];
    if (!content) {
      return null;
    }

    return (
      <div
        className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-base font-semibold text-gray-700">
            {content.title}
          </span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-500">
            {content.badge}
          </span>
        </div>
        <div className="px-4 pt-2 text-xs font-semibold text-gray-500">
          Credit Used
          <span className="float-right text-base text-gray-700">
            {content.used}
          </span>
        </div>
        <div className="mx-4 mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-medium text-red-500">
          {content.message}
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-blue-500 hover:text-blue-600"
        >
          Expand
          <span aria-hidden className="text-base">
            ↗
          </span>
        </button>
      </div>
    );
  };

  const updateProduct = (
    id: string,
    field: keyof ProductRow,
    value: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, [field]: value };

        // When the cargo type changes, prefill any empty dimension fields
        // from the API's defaultDimensions for that type. Existing user
        // input is preserved.
        if (field === "type") {
          const spec = getCargoSpec(value);
          const defaults = spec?.defaultDimensions;
          if (defaults) {
            if (!p.length) next.length = String(defaults.length);
            if (!p.height) next.height = String(defaults.height);
            // Only prefill width for non-cylindrical types
            if (!p.width && spec?.cylindrical !== true) {
              next.width = String(defaults.width);
            }
            // Cylindrical types don't use width — clear any stale value
            if (spec?.cylindrical === true) {
              next.width = "";
            }
          }
        }
        return next;
      }),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const newProduct = { ...product, id: Date.now().toString() };
      setProducts([...products, newProduct]);
    }
  };

  const CylinderIcon = ({ placement }: { placement: RollPlacement }) => {
    const squarePositions = [
      { x: 4, y: 0 },
      { x: 28, y: 0 },
      { x: 52, y: 0 },
      { x: 4, y: 26 },
      { x: 28, y: 26 },
      { x: 52, y: 26 },
    ];

    const hexPositions = [
      { x: 16, y: 0 },
      { x: 40, y: 0 },
      { x: 64, y: 0 },
      { x: 4, y: 26 },
      { x: 28, y: 26 },
      { x: 52, y: 26 },
      { x: 76, y: 26 },
    ];

    const positions = placement === "square" ? squarePositions : hexPositions;
    const bottomOffset = placement === "square" ? 0 : 8;

    return (
      <svg
        viewBox="0 0 100 70"
        className="h-24 w-24"
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`cylinder-body-${placement}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#dfe9fb" />
            <stop offset="100%" stopColor="#b9cff3" />
          </linearGradient>
        </defs>
        {positions.map((pos, index) => (
          <g
            key={`${placement}-${index}`}
            transform={`translate(${pos.x} ${pos.y + (index >= positions.length / 2 ? bottomOffset : 0)})`}
          >
            <ellipse
              cx="12"
              cy="5"
              rx="12"
              ry="5"
              fill="#eaf2ff"
              stroke="#8ab2ec"
              strokeWidth="0.8"
            />
            <rect
              x="0"
              y="5"
              width="24"
              height="26"
              fill={`url(#cylinder-body-${placement})`}
              stroke="#8ab2ec"
              strokeWidth="0.8"
            />
            <ellipse
              cx="12"
              cy="31"
              rx="12"
              ry="5"
              fill="#c2d7f5"
              stroke="#8ab2ec"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="pb-12">
      <div className="mx-auto w-full px-6">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
            <button
              onClick={() => setActiveTab("product")}
              className={`rounded-lg px-6 py-2 text-base font-medium transition-colors ${
                activeTab === "product"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Product
            </button>
            <button
              onClick={() => setActiveTab("containers")}
              className={`rounded-lg px-6 py-2 text-base font-medium transition-colors ${
                activeTab === "containers"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Containers & Trucks
            </button>
            <button
              onClick={() => setActiveTab("stuffing")}
              className={`rounded-lg px-6 py-2 text-base font-medium transition-colors ${
                activeTab === "stuffing"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Stuffing Result
            </button>
          </div>

          {/* Content */}
          {activeTab === "product" && (
            <div className="p-6">
              {/* Action Buttons */}
              <div
                className="mb-6 flex items-center justify-between"
                ref={actionAreaRef}
              >
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Group
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover("import")}
                      className="flex items-center gap-2 rounded-lg border border-green-500 bg-white px-4 py-2 text-base font-medium text-green-600 hover:bg-green-50"
                    >
                      <FileDown className="h-4 w-4" />
                      Import
                    </button>
                    {openPopover === "import" && renderPopover("import")}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover("export")}
                      className="flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <FileUp className="h-4 w-4" />
                      Export
                    </button>
                    {openPopover === "export" && renderPopover("export")}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover("upgrade")}
                      className="rounded-lg bg-orange-500 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-600"
                    >
                      Upgrade
                    </button>
                    {openPopover === "upgrade" && renderPopover("upgrade")}
                  </div>
                </div>
              </div>

              {/* Group Header */}
              <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-gray-800"></div>
                  <span className="text-base font-semibold text-gray-700">
                    Group #1
                  </span>
                  <button className="text-blue-500 hover:text-blue-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-blue-500 hover:bg-blue-50">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-blue-500 hover:bg-blue-50">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Type
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Product Name
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Length / Diameter
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Width
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Height
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Weight
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Quantity
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Color
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Stack
                      </th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Read-only cargo type badge. Type is now picked
                              via the CargoDesignModal popup (Add Product or
                              the gear icon to edit), not this dropdown. */}
                          <div className="flex h-10 min-w-[130px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                            <span className="text-lg">
                              {cargoTypeOptions.find(
                                (c) => c.id === product.type,
                              )?.icon ||
                                getCargoSpec(product.type)?.icon ||
                                "📦"}
                            </span>
                            <span className="capitalize">
                              {cargoTypeOptions.find(
                                (c) => c.id === product.type,
                              )?.label ||
                                getCargoSpec(product.type)?.name ||
                                product.type}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.productName}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "productName",
                                  e.target.value,
                                )
                              }
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.length}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "length",
                                  e.target.value,
                                )
                              }
                              placeholder={
                                isCylindrical(product.type) ? "Ø" : "0"
                              }
                              title={
                                isCylindrical(product.type)
                                  ? "Diameter"
                                  : "Length"
                              }
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">
                              {product.lengthUnit}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isCylindrical(product.type) ? (
                            <div
                              className="flex w-24 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
                              title="Not required for cylindrical types"
                            >
                              —
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={product.width}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "width",
                                    e.target.value,
                                  )
                                }
                                placeholder="0"
                                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                              />
                              <span className="text-xs text-gray-400">
                                {product.widthUnit}
                              </span>
                            </div>
                          )}
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.height}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "height",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">
                              {product.heightUnit}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.weight}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "weight",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">
                              {product.weightUnit}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.quantity}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">
                              {product.quantityUnit}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-8 w-8 rounded-full border-2 border-gray-200 cursor-pointer"
                              style={{ backgroundColor: product.color }}
                            ></div>
                            <button
                              className="rounded-lg p-1 text-blue-500 hover:bg-blue-50"
                              type="button"
                              title="Edit cargo"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open the same CargoDesignModal that the
                                // "Add Product" button uses, but in edit
                                // mode so this row's existing values are
                                // prefilled and the submit button reads
                                // "Update".
                                setEditingProductId(product.id);
                                setIsCargoDesignOpen(true);
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.stack}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "stack",
                                  e.target.value,
                                )
                              }
                              placeholder="mm"
                              className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => duplicateProduct(product.id)}
                              className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 transition-colors"
                              title="Duplicate product"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(product.id)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Product Button */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsCargoDesignOpen(true)}
                  className="flex items-center gap-2 text-base font-medium text-blue-500 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setUsePallets((v) => !v)}
                  aria-pressed={usePallets}
                  className={
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-base font-medium transition-colors " +
                    (usePallets
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-600")
                  }
                >
                  <span
                    className={
                      "h-4 w-4 rounded border " +
                      (usePallets
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 bg-white")
                    }
                  >
                    {usePallets && (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-4 w-4 text-white"
                      >
                        <path
                          d="M3 8l3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  Use Pallet ?
                </button>
                {usePallets && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">
                      Pallet type:
                    </label>
                    <select
                      value={palletType}
                      onChange={(e) => setPalletType(e.target.value)}
                      className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Auto (lightest available)</option>
                      {palletTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Selected pallet spec — fetched from GET /pallets/api?type=<type> */}
              {usePallets && palletType && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
                  {palletDetailsLoading && (
                    <span className="text-gray-500">
                      Loading pallet details…
                    </span>
                  )}
                  {!palletDetailsLoading && !selectedPalletSpec && (
                    <span className="text-gray-500">
                      No pallet record found for "{palletType}"
                    </span>
                  )}
                  {selectedPalletSpec && (
                    <>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor:
                              selectedPalletSpec.color &&
                              selectedPalletSpec.color !== "#000000"
                                ? selectedPalletSpec.color
                                : "#B07A3F",
                          }}
                          title={selectedPalletSpec.color || ""}
                        />
                        <span className="font-semibold text-gray-800">
                          {selectedPalletSpec.name}
                        </span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-700">
                        <span className="text-gray-500">L×W×H:</span>{" "}
                        {selectedPalletSpec.dimensions.length} ×{" "}
                        {selectedPalletSpec.dimensions.width} ×{" "}
                        {selectedPalletSpec.dimensions.height} mm
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-700">
                        <span className="text-gray-500">Max weight:</span>{" "}
                        {selectedPalletSpec.maxWeight} kg
                      </span>
                      {selectedPalletSpec.material && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-700">
                            <span className="text-gray-500">Material:</span>{" "}
                            {selectedPalletSpec.material}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Next Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    // Validate that at least one product has data.
                    // Cylindrical types (barrels, roll, pipes) don't use width.
                    const validProducts = products.filter((p) => {
                      const cyl = isCylindrical(p.type);
                      return (
                        parseFloat(p.length) > 0 &&
                        (cyl || parseFloat(p.width) > 0) &&
                        parseFloat(p.height) > 0 &&
                        parseFloat(p.weight) > 0 &&
                        parseInt(p.quantity) > 0
                      );
                    });
                    if (validProducts.length === 0) {
                      setApiError(
                        "Please fill in dimensions, weight, and quantity for at least one product.",
                      );
                      setActiveTab("stuffing");
                      return;
                    }
                    // Go to containers tab for container selection
                    setActiveTab("containers");
                  }}
                  className="rounded-lg bg-blue-500 px-8 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === "containers" && (
            <div className="p-6">
              {/* Action Buttons */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsContainerSelectionOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Container
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTruckComingSoon(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Truck
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="automatic-container"
                    checked={automaticContainerSelection}
                    onChange={(e) =>
                      setAutomaticContainerSelection(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="automatic-container"
                    className="text-base font-medium text-gray-700 cursor-pointer"
                  >
                    Automatic Container Selection
                  </label>
                </div>
              </div>

              {/* Container Cards */}
              {containers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {containers.map((container, index) => (
                    <div
                      key={container.id}
                      className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      {/* Actions */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            const newContainer = {
                              ...container,
                              id: Date.now(),
                            };
                            setContainers((prev) => [...prev, newContainer]);
                          }}
                          className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Duplicate container"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setContainers((prev) =>
                              prev.filter((c) => c.id !== container.id),
                            )
                          }
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove container"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Container Name & Number */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <p className="text-base font-bold text-gray-800">
                          {container.name}
                        </p>
                      </div>

                      {/* 3D Container Illustration */}
                      <div className="mt-3 flex h-36 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3">
                        <Container3D size={container.size} />
                      </div>

                      {/* Specs */}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dimensions</span>
                          <span className="font-medium text-gray-700">
                            {container.dimensions}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Capacity</span>
                          <span className="font-medium text-gray-700">
                            {container.capacity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Max Weight</span>
                          <span className="font-medium text-gray-700">
                            {container.maxWeight}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
                  {/* Transport Illustration */}
                  <div className="mb-6">
                    <svg viewBox="0 0 200 140" className="h-40 w-40">
                      <defs>
                        <linearGradient
                          id="platformGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#dbeafe" />
                          <stop offset="100%" stopColor="#bfdbfe" />
                        </linearGradient>
                        <linearGradient
                          id="containerGradient1"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient
                          id="containerGradient2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <filter id="shadow">
                          <feDropShadow
                            dx="0"
                            dy="2"
                            stdDeviation="3"
                            floodOpacity="0.15"
                          />
                        </filter>
                      </defs>

                      {/* Platform/Base */}
                      <ellipse
                        cx="100"
                        cy="120"
                        rx="80"
                        ry="12"
                        fill="url(#platformGradient)"
                        opacity="0.6"
                      />

                      {/* Container 1 (Back) */}
                      <g filter="url(#shadow)">
                        <path
                          d="M 50 70 L 90 70 L 90 110 L 50 110 Z"
                          fill="url(#containerGradient2)"
                          stroke="#2563eb"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 90 70 L 105 62 L 105 102 L 90 110 Z"
                          fill="#1e40af"
                          stroke="#2563eb"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 50 70 L 90 70 L 105 62 L 65 62 Z"
                          fill="#93c5fd"
                          stroke="#2563eb"
                          strokeWidth="1.5"
                        />
                        {[...Array(4)].map((_, i) => (
                          <line
                            key={`c1-${i}`}
                            x1={58 + i * 10}
                            y1={75}
                            x2={58 + i * 10}
                            y2={105}
                            stroke="#2563eb"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                      </g>

                      {/* Container 2 (Front) */}
                      <g filter="url(#shadow)">
                        <path
                          d="M 95 60 L 145 60 L 145 105 L 95 105 Z"
                          fill="url(#containerGradient1)"
                          stroke="#1d4ed8"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 145 60 L 163 51 L 163 96 L 145 105 Z"
                          fill="#1e3a8a"
                          stroke="#1d4ed8"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 95 60 L 145 60 L 163 51 L 113 51 Z"
                          fill="#60a5fa"
                          stroke="#1d4ed8"
                          strokeWidth="1.5"
                        />
                        {[...Array(5)].map((_, i) => (
                          <line
                            key={`c2-${i}`}
                            x1={105 + i * 10}
                            y1={65}
                            x2={105 + i * 10}
                            y2={100}
                            stroke="#1d4ed8"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                        <circle cx="115" cy="82" r="2" fill="#1e3a8a" />
                        <circle cx="135" cy="82" r="2" fill="#1e3a8a" />
                      </g>

                      <circle
                        cx="70"
                        cy="115"
                        r="3"
                        fill="#3b82f6"
                        opacity="0.6"
                      />
                      <circle
                        cx="120"
                        cy="110"
                        r="3"
                        fill="#3b82f6"
                        opacity="0.6"
                      />
                    </svg>
                  </div>

                  <p className="text-base font-medium text-gray-600">
                    Please add transport
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex flex-col items-center gap-2">
                {containers.length === 0 && !automaticContainerSelection && (
                  <p className="text-sm text-amber-600 font-medium">
                    Please add at least one container, or enable Automatic
                    Container Selection.
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab("product")}
                    className="rounded-lg px-8 py-2.5 text-base font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (
                        containers.length === 0 &&
                        !automaticContainerSelection
                      )
                        return;
                      handleShowStuffingResults();
                    }}
                    disabled={
                      (containers.length === 0 &&
                        !automaticContainerSelection) ||
                      isCalculating
                    }
                    className="rounded-lg bg-blue-500 px-8 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCalculating && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isCalculating ? "Calculating..." : "Next"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stuffing" && (
            <div className="p-0">
              {isCalculating ? (
                <div className="flex flex-col items-center justify-center p-16 text-gray-500">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="mt-4 text-lg font-medium">
                    Calculating optimal load...
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Analyzing products and container configurations
                  </p>
                </div>
              ) : apiError ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <X className="h-7 w-7 text-red-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    Calculation Error
                  </p>
                  <p className="mt-2 text-sm text-red-500">{apiError}</p>
                  <button
                    onClick={() => {
                      setApiError(null);
                      setActiveTab("product");
                    }}
                    className="mt-6 rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    Back to Products
                  </button>
                </div>
              ) : showStuffingResult && stuffingData ? (
                <StuffingResultPage
                  containerType={stuffingData.containerType || "20' Standard"}
                  containerName={
                    stuffingData.containerName || "20' Standard #1"
                  }
                  containerSize={stuffingData.containerSize || "20ft"}
                  totalPackages={stuffingData.totalPackages}
                  cargoVolume={stuffingData.cargoVolume}
                  volumePercentage={stuffingData.volumePercentage}
                  cargoWeight={stuffingData.cargoWeight}
                  weightPercentage={stuffingData.weightPercentage}
                  maxWeight={stuffingData.maxWeight}
                  totalVolume={stuffingData.totalVolume}
                  cargoItems={stuffingData.cargoItems}
                  apiResponse={stuffingData.apiResponse}
                  onBack={handleCloseStuffingResults}
                />
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg font-medium">Stuffing Result</p>
                  <p className="mt-2 text-base">
                    Select a product or container to view stuffing results.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isColorSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeColorSettings}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Color Stack Settings
                </h2>
                <p className="mt-1 text-base text-gray-500">
                  Configure measurement units and roll placement for this
                  product.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={closeColorSettings}
                aria-label="Close color stack settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-base font-medium text-gray-700">
                  <span>Length Units</span>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                    value={settingsForm.lengthUnit}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        lengthUnit: event.target.value,
                      }))
                    }
                  >
                    {LENGTH_UNITS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-base font-medium text-gray-700">
                  <span>Mass Units</span>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
                    value={settingsForm.massUnit}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        massUnit: event.target.value,
                      }))
                    }
                  >
                    {MASS_UNITS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-base font-medium text-gray-700">
                <span>Length Accuracy</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:outline-none md:w-40"
                  value={settingsForm.lengthAccuracy}
                  onChange={(event) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      lengthAccuracy: event.target.value,
                    }))
                  }
                >
                  {LENGTH_ACCURACIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="text-base font-medium text-gray-700">
                  Roll Placement
                </p>
                <div className="mt-3 grid gap-6 md:grid-cols-2">
                  {(["square", "hexagon"] as RollPlacement[]).map(
                    (placement) => {
                      const isActive = settingsForm.rollPlacement === placement;
                      return (
                        <label
                          key={placement}
                          className={`flex flex-col items-center rounded-2xl border px-6 py-6 text-center transition ${
                            isActive
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="roll-placement"
                            value={placement}
                            checked={isActive}
                            onChange={() =>
                              setSettingsForm((prev) => ({
                                ...prev,
                                rollPlacement: placement,
                              }))
                            }
                            className="sr-only"
                          />
                          <CylinderIcon placement={placement} />
                          <div className="mt-4 flex items-center justify-center gap-2 text-base font-medium text-gray-600">
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                isActive ? "border-blue-500" : "border-gray-300"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isActive ? "bg-blue-500" : "bg-transparent"
                                }`}
                              ></span>
                            </span>
                            <span className="capitalize">{placement}</span>
                          </div>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-base font-medium text-gray-500 transition hover:bg-gray-100"
                onClick={closeColorSettings}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-blue-500 px-6 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-blue-600"
                onClick={() => setIsCargoDesignOpen(true)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <CargoDesignModal
        isOpen={isCargoDesignOpen}
        onClose={() => {
          setIsCargoDesignOpen(false);
          setEditingProductId(null);
        }}
        onAdd={addProductFromModal}
        initialData={
          editingProduct ? buildInitialDataForRow(editingProduct) : undefined
        }
      />
      <ContainerSelectionModal
        isOpen={isContainerSelectionOpen}
        onClose={() => setIsContainerSelectionOpen(false)}
        onSelect={(containerType) => {
          const option = CONTAINER_SPEC_OPTIONS.find(
            (c) => c.id === containerType,
          );
          if (option) {
            const newContainer: {
              id: number;
              type: string;
              name: string;
              size: "20ft" | "40ft";
              dimensions: string;
              capacity: string;
              maxWeight: string;
            } = {
              id: Date.now(),
              type: option.id,
              name: option.name,
              size: option.size,
              dimensions: option.dimensions,
              capacity: option.capacity,
              maxWeight: option.maxWeight,
            };
            setContainers((prev) => [...prev, newContainer]);
          }
          if (onNavigateToContainer) {
            onNavigateToContainer(containerType);
          }
        }}
      />

      {/* Truck Coming Soon Modal */}
      {showTruckComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowTruckComingSoon(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setShowTruckComingSoon(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-amber-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 3h15v13H1z" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Coming Soon</h3>
            <p className="mt-2 text-sm text-gray-500">
              Truck loading calculation is currently under development and will
              be available soon.
            </p>
            <button
              type="button"
              onClick={() => setShowTruckComingSoon(false)}
              className="mt-6 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadCalculator;

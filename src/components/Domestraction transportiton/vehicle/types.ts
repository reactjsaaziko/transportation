// ===================== COMMON TYPES =====================

export interface Product {
  name: string;
  length: number; // mm
  width: number; // mm
  height: number; // mm
  weight: number; // kg
  quantity: number;
  cargoType?: string;
  color?: string;
  spacingSettings?: SpacingSettings;
  stuffingSettings?: StuffingSettings;
}

export interface SpacingSettings {
  tiltToLength?: boolean;
  tiltToWidth?: boolean;
  tiltToHeight?: boolean;
}

export interface StuffingSettings {
  layersCount?: number;
  height?: number; // mm
  mass?: number; // kg
  disableStacking?: boolean;
}

export interface Preferences {
  preferSmaller?: boolean;
  preferredContainer?: string;
  preferredContainerType?: string;
  maxContainers?: number;
}

// ===================== API RESPONSE WRAPPER =====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ===================== CONTAINER TYPES =====================

export interface ContainerSpec {
  name: string;
  key?: string;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
  volume: number;
  category?: string;
}

export interface ContainerUtilization {
  volumeUtilization: number;
  weightUtilization: number;
  remainingVolume?: number;
  remainingWeight?: number;
}

export interface Visualization3DItem {
  id: number;
  name: string;
  color: string;
  position: { x: number; y: number; z: number };
  dimensions: { length: number; width: number; height: number };
  rotation?: { x: number; y: number; z: number };
  cargoType?: string;
}

export interface Visualization3D {
  containerDimensions: {
    length: number;
    width: number;
    height: number;
  };
  cargoItems: Visualization3DItem[];
}

export interface ContainerCargoDetail {
  productName: string;
  cargoType: string;
  quantity: number;
  totalWeight: string;
  totalVolume: string;
}

export interface ContainerSummary {
  totalPackages: number;
  totalWeight: string;
  totalVolume: string;
}

export interface ContainerBreakdown {
  containerId: string;
  containerType: string;
  utilization: {
    cargoVolume: string;
    cargoWeight: string;
    remainingVolume: string;
    remainingWeight: string;
  };
  cargoDetails: ContainerCargoDetail[];
  containerSummary: ContainerSummary;
  visualization3D?: Visualization3D;
}

// ===================== CALCULATE MULTIPLE CONTAINERS =====================

export interface CalculateMultipleContainersRequest {
  products: Product[];
  preferences?: Preferences;
  spacingSettings?: SpacingSettings;
  stuffingSettings?: StuffingSettings;
  usePallets?: boolean;
  palletType?: string | null;
}

// Minimal format response
export interface CalculateMultipleContainersMinimalResponse {
  totalContainers: number;
  containerType?: string;
  overallEfficiency: string;
  totalCost: string;
  totalVolume: string;
  totalWeight: string;
  containerMix?: Record<string, number>;
  containers: ContainerBreakdown[];
  summary: {
    allProductsFit: boolean;
    recommendation: string;
  };
  autoOptimization?: {
    applied: boolean;
    spacingSettings: SpacingSettings;
    stuffingSettings: StuffingSettings;
    message: string;
  };
  palletInfo?: PalletInfo;
}

export interface PalletInfo {
  used: boolean;
  pallet: {
    id: string;
    name: string;
    type: string;
    dimensions: { length: number; width: number; height: number };
    maxWeight: number;
    color: string;
  };
  message: string;
}

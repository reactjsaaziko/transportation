export type ContainerVariant =
  | 'standard'
  | 'high-cube'
  | 'open-top'
  | 'flatrack'
  | 'flatrack-collapsible'
  | 'platform'
  | 'refrigerated'
  | 'bulk'
  | 'tank'
  | 'custom';

export type ContainerSize = 'short' | 'long' | 'xlong';

export type TruckVariant = 'tautliner' | 'refrigerated' | 'isotherm' | 'mega-trailer' | 'jumbo' | 'custom';

export interface ContainerOption {
  id: string;
  name: string;
  variant: ContainerVariant;
  size: ContainerSize;
}

export interface ContainerDetail {
  metrics: {
    insideLength: string;
    insideWidth: string;
    insideHeight: string;
    doorWidth: string;
    doorHeight: string;
    capacity: string;
    tareWeight: string;
    maxCargoWeight: string;
  };
  description: string;
  highlights: string[];
}

export const CONTAINER_OPTIONS: ContainerOption[] = [
  { id: '20-standard', name: "20' STANDARD", variant: 'standard', size: 'short' },
  { id: '40-standard', name: "40' STANDARD", variant: 'standard', size: 'long' },
  { id: '40-high-cube', name: "40' HIGH CUBE", variant: 'high-cube', size: 'long' },
  { id: '45-high-cube', name: "45' HIGH CUBE", variant: 'high-cube', size: 'xlong' },
  { id: '20-open-top', name: "20' OPEN TOP", variant: 'open-top', size: 'short' },
  { id: '40-open-top', name: "40' OPEN TOP", variant: 'open-top', size: 'long' },
  { id: '20-flatrack', name: "20' FLATRACK", variant: 'flatrack', size: 'short' },
  { id: '40-flatrack', name: "40' FLATRACK", variant: 'flatrack', size: 'long' },
  { id: '20-flatrack-collapsible', name: "20' FLATRACK COLLAPSIBLE", variant: 'flatrack-collapsible', size: 'short' },
  { id: '45-flatrack-collapsible', name: "45' FLATRACK COLLAPSIBLE", variant: 'flatrack-collapsible', size: 'xlong' },
  { id: '20-platform', name: "20' PLATFORM", variant: 'platform', size: 'short' },
  { id: '40-platform', name: "40' PLATFORM", variant: 'platform', size: 'long' },
  { id: '20-refrigerated', name: "20' REFRIGERATED", variant: 'refrigerated', size: 'short' },
  { id: '40-refrigerated', name: "40' REFRIGERATED", variant: 'refrigerated', size: 'long' },
  { id: '20-bulk', name: "20' BULK", variant: 'bulk', size: 'short' },
  { id: '20-tank', name: "20' TANK", variant: 'tank', size: 'short' },
  { id: 'custom-container', name: 'CUSTOM CONTAINER', variant: 'custom', size: 'long' },
];

export const CONTAINER_DETAILS: Record<string, ContainerDetail> = {
  '20-standard': {
    metrics: {
      insideLength: '5.895 m',
      insideWidth: '2.350 m',
      insideHeight: '2.392 m',
      doorWidth: '2.340 m',
      doorHeight: '2.292 m',
      capacity: '33 m3',
      tareWeight: '2230 Kgs',
      maxCargoWeight: '28230 Kgs',
    },
    description: 'Standard containers are also known as general purpose containers',
    highlights: [
      'Standard containers with doors at one or both end(s)',
      'Standard containers with doors at one or both end(s) and doors over the entire length of one or both sides',
      'Standard containers with doors at one or both end(s) and doors on one or both sides',
      'In addition, the various types of standard container also differ in dimensions and weight, resulting in a wide range of standard containers.',
    ],
  },
  '40-standard': {
    metrics: {
      insideLength: '12.032 m',
      insideWidth: '2.350 m',
      insideHeight: '2.392 m',
      doorWidth: '2.340 m',
      doorHeight: '2.292 m',
      capacity: '67 m3',
      tareWeight: '3780 Kgs',
      maxCargoWeight: '26700 Kgs',
    },
    description: 'Standard 40-foot containers are the most common shipping containers used worldwide for general cargo transportation.',
    highlights: [
      'Ideal for general cargo and dry goods',
      'Standard doors at one or both ends',
      'Weather-resistant construction',
      'Most economical option for long-distance shipping',
    ],
  },
  '40-high-cube': {
    metrics: {
      insideLength: '12.032 m',
      insideWidth: '2.350 m',
      insideHeight: '2.698 m',
      doorWidth: '2.340 m',
      doorHeight: '2.585 m',
      capacity: '76 m3',
      tareWeight: '3940 Kgs',
      maxCargoWeight: '26540 Kgs',
    },
    description: 'High cube containers offer extra height compared to standard containers, making them ideal for light, voluminous cargo.',
    highlights: [
      'Extra height (1 foot taller than standard)',
      'Perfect for light, bulky cargo',
      'Same length and width as standard 40-foot containers',
      'Maximizes volume capacity',
    ],
  },
  '45-high-cube': {
    metrics: {
      insideLength: '13.556 m',
      insideWidth: '2.350 m',
      insideHeight: '2.698 m',
      doorWidth: '2.340 m',
      doorHeight: '2.585 m',
      capacity: '86 m3',
      tareWeight: '4800 Kgs',
      maxCargoWeight: '27700 Kgs',
    },
    description: '45-foot high cube containers provide maximum volume capacity for oversized cargo.',
    highlights: [
      'Largest standard container size',
      'Extra length and height',
      'Ideal for oversized or palletized cargo',
      'Maximum volume utilization',
    ],
  },
  '20-open-top': {
    metrics: {
      insideLength: '5.895 m',
      insideWidth: '2.350 m',
      insideHeight: '2.392 m',
      doorWidth: '2.340 m',
      doorHeight: '2.292 m',
      capacity: '33 m3',
      tareWeight: '2360 Kgs',
      maxCargoWeight: '28120 Kgs',
    },
    description: 'Open top containers feature a removable or convertible roof for easy top loading of oversized cargo.',
    highlights: [
      'Removable tarpaulin roof',
      'Easy loading from top with cranes',
      'Perfect for tall or heavy cargo',
      'Flexible loading options',
    ],
  },
  '40-open-top': {
    metrics: {
      insideLength: '12.032 m',
      insideWidth: '2.350 m',
      insideHeight: '2.392 m',
      doorWidth: '2.340 m',
      doorHeight: '2.292 m',
      capacity: '67 m3',
      tareWeight: '3920 Kgs',
      maxCargoWeight: '26560 Kgs',
    },
    description: '40-foot open top containers allow top loading for cargo that exceeds standard door dimensions.',
    highlights: [
      'Large open top access',
      'Suitable for machinery and equipment',
      'Weather-protected with tarpaulin cover',
      'Versatile loading methods',
    ],
  },
  '20-flatrack': {
    metrics: {
      insideLength: '5.940 m',
      insideWidth: '2.350 m',
      insideHeight: '2.346 m',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '2580 Kgs',
      maxCargoWeight: '27900 Kgs',
    },
    description: 'Flatrack containers have collapsible or fixed ends with no roof or side walls, ideal for heavy or oversized cargo.',
    highlights: [
      'No side walls or roof',
      'Fixed or collapsible end walls',
      'Perfect for heavy machinery',
      'Easy loading from all sides',
    ],
  },
  '40-flatrack': {
    metrics: {
      insideLength: '12.080 m',
      insideWidth: '2.350 m',
      insideHeight: '2.346 m',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '5000 Kgs',
      maxCargoWeight: '40000 Kgs',
    },
    description: '40-foot flatracks provide maximum flexibility for oversized and heavy cargo transportation.',
    highlights: [
      'Maximum weight capacity',
      'Open platform design',
      'Ideal for construction equipment',
      'Secure lashing points',
    ],
  },
  '20-flatrack-collapsible': {
    metrics: {
      insideLength: '5.940 m',
      insideWidth: '2.350 m',
      insideHeight: '2.346 m',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '2620 Kgs',
      maxCargoWeight: '27860 Kgs',
    },
    description: 'Collapsible flatracks feature folding ends for efficient return shipping and storage.',
    highlights: [
      'Collapsible end walls',
      'Space-efficient when empty',
      'Cost-effective for one-way shipments',
      'Versatile cargo options',
    ],
  },
  '45-flatrack-collapsible': {
    metrics: {
      insideLength: '13.556 m',
      insideWidth: '2.438 m',
      insideHeight: '2.591 m',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '5200 Kgs',
      maxCargoWeight: '42300 Kgs',
    },
    description: 'Extra-long collapsible flatracks for the largest and heaviest cargo.',
    highlights: [
      'Maximum length and capacity',
      'Collapsible for return efficiency',
      'Heavy-duty construction',
      'Industrial equipment transport',
    ],
  },
  '20-platform': {
    metrics: {
      insideLength: '6.058 m',
      insideWidth: '2.438 m',
      insideHeight: 'Open',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '2500 Kgs',
      maxCargoWeight: '27980 Kgs',
    },
    description: 'Platform containers are flat platforms without walls or roof, designed for heavy or oversized cargo.',
    highlights: [
      'Completely open platform',
      'No walls or roof restrictions',
      'Maximum flexibility',
      'Heavy machinery capable',
    ],
  },
  '40-platform': {
    metrics: {
      insideLength: '12.192 m',
      insideWidth: '2.438 m',
      insideHeight: 'Open',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: 'Open',
      tareWeight: '4800 Kgs',
      maxCargoWeight: '40680 Kgs',
    },
    description: '40-foot platforms provide maximum space for oversized industrial cargo.',
    highlights: [
      'Extra-long platform',
      'No height restrictions',
      'Heavy-duty construction',
      'Versatile lashing options',
    ],
  },
  '20-refrigerated': {
    metrics: {
      insideLength: '5.444 m',
      insideWidth: '2.268 m',
      insideHeight: '2.272 m',
      doorWidth: '2.276 m',
      doorHeight: '2.261 m',
      capacity: '28 m3',
      tareWeight: '3080 Kgs',
      maxCargoWeight: '27400 Kgs',
    },
    description: 'Refrigerated containers maintain controlled temperature for perishable goods and temperature-sensitive cargo.',
    highlights: [
      'Temperature control from -25°C to +25°C',
      'Built-in refrigeration unit',
      'Insulated walls and ceiling',
      'Ideal for food, pharmaceuticals, and chemicals',
    ],
  },
  '40-refrigerated': {
    metrics: {
      insideLength: '11.585 m',
      insideWidth: '2.286 m',
      insideHeight: '2.250 m',
      doorWidth: '2.286 m',
      doorHeight: '2.261 m',
      capacity: '59 m3',
      tareWeight: '4800 Kgs',
      maxCargoWeight: '27700 Kgs',
    },
    description: '40-foot refrigerated containers offer larger capacity for temperature-controlled cargo.',
    highlights: [
      'Extended cold chain capacity',
      'Precise temperature control',
      'Energy-efficient cooling system',
      'Suitable for long-distance transport',
    ],
  },
  '20-bulk': {
    metrics: {
      insideLength: '5.895 m',
      insideWidth: '2.350 m',
      insideHeight: '2.392 m',
      doorWidth: '2.340 m',
      doorHeight: '2.292 m',
      capacity: '33 m3',
      tareWeight: '2400 Kgs',
      maxCargoWeight: '28080 Kgs',
    },
    description: 'Bulk containers feature top loading hatches for dry bulk cargo like grains, minerals, and powders.',
    highlights: [
      'Top loading hatches',
      'Designed for dry bulk materials',
      'Easy discharge systems',
      'Suitable for agricultural products',
    ],
  },
  '20-tank': {
    metrics: {
      insideLength: '6.058 m',
      insideWidth: '2.438 m',
      insideHeight: '2.591 m',
      doorWidth: 'N/A',
      doorHeight: 'N/A',
      capacity: '26000 L',
      tareWeight: '3500 Kgs',
      maxCargoWeight: '27000 Kgs',
    },
    description: 'Tank containers are designed for transporting liquids, gases, and powders in bulk.',
    highlights: [
      'Stainless steel tank construction',
      'Suitable for hazardous materials',
      'Pressure-tested and certified',
      'Temperature control available',
    ],
  },
  'custom-container': {
    metrics: {
      insideLength: 'Custom',
      insideWidth: 'Custom',
      insideHeight: 'Custom',
      doorWidth: 'Custom',
      doorHeight: 'Custom',
      capacity: 'Custom',
      tareWeight: 'Custom',
      maxCargoWeight: 'Custom',
    },
    description: 'Custom containers can be modified to meet specific requirements for unique cargo needs.',
    highlights: [
      'Tailored to your specifications',
      'Custom modifications available',
      'Specialized equipment integration',
      'Unique cargo solutions',
    ],
  },
};

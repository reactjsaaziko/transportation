export type FreightOrderTab = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

export interface FreightOrder {
  id: string;
  status: FreightOrderTab;
  origin: string;
  stopover?: string;
  destination: string;
  cargoType: string;
  product: string;
  totalPackages: string;
  cargoWeight: string;
  cargoVolume: string;
  transitTime: string;
  vesselName: string;
  shippingLine: string;
  cargoReadyDate: string;
  price: string;
  hsCode?: string;
  tripId?: string;
  invoiceStatus?: string;
}

export const freightOrders: FreightOrder[] = [
  {
    id: '151515',
    status: 'Yet to confirm',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 /-',
  },
  {
    id: '151516',
    status: 'Yet to confirm',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 /-',
  },
  {
    id: '151517',
    status: 'Current',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 / Rs.',
    hsCode: '505050',
    tripId: '151515',
  },
  {
    id: '151518',
    status: 'Current',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 / Rs.',
    hsCode: '505050',
    tripId: '151515',
  },
  {
    id: '151519',
    status: 'Upcoming',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 /.-',
  },
  {
    id: '151520',
    status: 'Upcoming',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '28 Days',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: '25,000 /.-',
  },
  {
    id: '151521',
    status: 'Completed',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '45 km approx',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: 'INR 2000/SB',
    invoiceStatus: 'Pending',
    tripId: '151515',
  },
  {
    id: '151522',
    status: 'Completed',
    origin: 'A City, Stat, Country',
    stopover: 'B City, Stat, Country',
    destination: 'C City, Stat, Country',
    cargoType: 'Normal',
    product: 'Plastic Cup',
    totalPackages: '210 packages',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    transitTime: '45 km approx',
    vesselName: 'CUL mania 233E',
    shippingLine: 'CU Line',
    cargoReadyDate: '14, Jan, 2023',
    price: 'INR 2000/SB',
    invoiceStatus: 'Payment Transfer',
    tripId: '151515',
  },
];

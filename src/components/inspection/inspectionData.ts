export type InspectionTab = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

export interface InspectionOrder {
  id: string;
  status: InspectionTab;
  product: string;
  goodsType: string;
  goodsName: string;
  city: string;
  totalPackages: string;
  port: string;
  inspectionType: string;
  cargoWeight: string;
  cargoWeightDetail?: string;
  cargoVolume: string;
  cargoVolumeDetail?: string;
  price: string;
  inspectionDate: string;
  referenceLabel?: string;
  referenceValue?: string;
  hsCode?: string;
  address?: string;
  contactPerson?: string;
  inspectionCriteria?: string;
  timeline?: {
    startDate: string;
    startTime: string;
    startInspector: string;
    completeDate: string;
    completeTime: string;
    completeInspector: string;
  };
  invoiceStatus?: string;
}

export const inspectionOrders: InspectionOrder[] = [
  {
    id: '151515',
    status: 'Yet to confirm',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Mumbai',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151515',
  },
  {
    id: '151516',
    status: 'Yet to confirm',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Mumbai',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151516',
  },
  {
    id: '151517',
    status: 'Current',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoWeightDetail: '14500.00 kg (1% of max weight)',
    cargoVolume: '29.50 M3',
    cargoVolumeDetail: '29.50 m3 (32% volume)',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Trip Id',
    referenceValue: '151515',
    hsCode: '535325',
    address: '34, Katargam GIDC, Katargam, Surat',
    contactPerson: 'Manoj Rathod',
    timeline: {
      startDate: '14 Jan, 2023',
      startTime: '22:00 PM',
      startInspector: 'Inspector Name',
      completeDate: '16 Jan, 2023',
      completeTime: '22:00 PM',
      completeInspector: 'Inspector Name',
    },
    inspectionCriteria: '',
  },
  {
    id: '151518',
    status: 'Current',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoWeightDetail: '14500.00 kg(1% of max weight)',
    cargoVolume: '29.50 M3',
    cargoVolumeDetail: '29.50 m3 (32% volume)',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Trip Id',
    referenceValue: '151516',
    hsCode: '535325',
    address: 'Warehouse 5, Andheri Industrial Estate, Mumbai',
    contactPerson: 'Manoj Rathod',
    timeline: {
      startDate: '14 Jan, 2023',
      startTime: '22:00 PM',
      startInspector: 'Inspector Name',
      completeDate: '16 Jan, 2023',
      completeTime: '22:00 PM',
      completeInspector: 'Inspector Name',
    },
    inspectionCriteria: '',
  },
  {
    id: '151519',
    status: 'Upcoming',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoWeightDetail: '14500.00 kg(1% of max weight)',
    cargoVolume: '29.50 M3',
    cargoVolumeDetail: '29.50 m3 (32% volume)',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151519',
    address: '34, Katargam GIDC, Katargam, Surat',
    contactPerson: 'Manoj Rathod',
    inspectionCriteria: '',
  },
  {
    id: '151520',
    status: 'Upcoming',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoWeightDetail: '14500.00 kg(1% of max weight)',
    cargoVolume: '29.50 M3',
    cargoVolumeDetail: '29.50 m3 (32% volume)',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151520',
    address: '34, Katargam GIDC, Katargam, Surat',
    contactPerson: 'Manoj Rathod',
    inspectionCriteria: '',
  },
  {
    id: '151521',
    status: 'Completed',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151521',
    invoiceStatus: 'Payment Transfer',
  },
  {
    id: '151522',
    status: 'Completed',
    product: 'Plastic Cup',
    goodsType: 'Normal',
    goodsName: 'Plastic Cup',
    city: 'Surat',
    totalPackages: '210 packages',
    port: 'Sahar, Mumbai',
    inspectionType: 'Remote',
    cargoWeight: '14,500.00 kg',
    cargoVolume: '29.50 M3',
    price: 'INR 2000/SB',
    inspectionDate: '14, Jan, 2023',
    referenceLabel: 'Order Id',
    referenceValue: '151522',
    invoiceStatus: 'Pending',
  },
];

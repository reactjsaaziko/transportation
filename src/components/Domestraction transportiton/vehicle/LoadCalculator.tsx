import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Copy, Settings, FileDown, FileUp, X } from 'lucide-react';
import CargoDesignModal from './CargoDesignModal';
import ContainerSelectionModal from './ContainerSelectionModal';

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
}

type RollPlacement = 'square' | 'hexagon';

const LoadCalculator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'product' | 'containers' | 'stuffing'>('product');
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: '1',
      type: 'box',
      productName: 'Boxes 1',
      length: '',
      lengthUnit: 'mm',
      width: '',
      widthUnit: 'mm',
      height: '',
      heightUnit: 'mm',
      weight: '',
      weightUnit: 'kg',
      quantity: '10',
      quantityUnit: 'mm',
      color: '#22c55e',
      stack: '',
      lengthAccuracy: '5',
      rollPlacement: 'square',
    },
    {
      id: '2',
      type: 'box',
      productName: 'Boxes 1',
      length: '',
      lengthUnit: 'mm',
      width: '',
      widthUnit: 'mm',
      height: '',
      heightUnit: 'mm',
      weight: '',
      weightUnit: 'kg',
      quantity: '10',
      quantityUnit: 'mm',
      color: '#ec4899',
      stack: '',
      lengthAccuracy: '5',
      rollPlacement: 'square',
    },
    {
      id: '3',
      type: 'box',
      productName: 'Boxes 1',
      length: '',
      lengthUnit: 'mm',
      width: '',
      widthUnit: 'mm',
      height: '',
      heightUnit: 'mm',
      weight: '',
      weightUnit: 'kg',
      quantity: '10',
      quantityUnit: 'mm',
      color: '#3b82f6',
      stack: '',
      lengthAccuracy: '5',
      rollPlacement: 'square',
    },
  ]);

  const addProduct = () => {
    const newProduct: ProductRow = {
      id: Date.now().toString(),
      type: 'box',
      productName: 'Boxes 1',
      length: '',
      lengthUnit: 'mm',
      width: '',
      widthUnit: 'mm',
      height: '',
      heightUnit: 'mm',
      weight: '',
      weightUnit: 'kg',
      quantity: '10',
      quantityUnit: 'mm',
      color: '#3b82f6',
      stack: '',
      lengthAccuracy: '5',
      rollPlacement: 'square',
    };

    setProducts([...products, newProduct]);
  };

  const [openPopover, setOpenPopover] = useState<'add-group' | 'import' | 'export' | 'upgrade' | null>(null);
  const actionAreaRef = useRef<HTMLDivElement | null>(null);
  const [isColorSettingsOpen, setIsColorSettingsOpen] = useState(false);
  const [isCargoDesignOpen, setIsCargoDesignOpen] = useState(false);
  const [isContainerSelectionOpen, setIsContainerSelectionOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [automaticContainerSelection, setAutomaticContainerSelection] = useState(true);
  const [containers, setContainers] = useState<any[]>([]);
  const [settingsForm, setSettingsForm] = useState({
    lengthUnit: 'mm',
    massUnit: 'kg',
    lengthAccuracy: '5',
    rollPlacement: 'square' as RollPlacement,
  });

  const LENGTH_UNITS = [
    { label: 'Millimeters', value: 'mm' },
    { label: 'Centimeters', value: 'cm' },
    { label: 'Meters', value: 'm' },
  ];

  const MASS_UNITS = [
    { label: 'Kilograms', value: 'kg' },
    { label: 'Grams', value: 'g' },
    { label: 'Pounds', value: 'lb' },
  ];

  const LENGTH_ACCURACIES = ['1', '2', '5', '10'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPopover && actionAreaRef.current && !actionAreaRef.current.contains(event.target as Node)) {
        setOpenPopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openPopover]);

  const popoverContent = {
    'add-group': {
      title: 'Plan',
      badge: 'Free',
      used: '3 / 3',
      message: 'You have reached the limit. Please purchase additional credits',
    },
    import: {
      title: 'Import Limit',
      badge: 'Free',
      used: '3 / 3',
      message: 'Upgrade your plan to unlock bulk import for more products',
    },
    export: {
      title: 'Export Limit',
      badge: 'Free',
      used: '3 / 3',
      message: 'You have reached the export quota. Upgrade to continue exporting',
    },
    upgrade: {
      title: 'Plan',
      badge: 'Free',
      used: '3 / 3',
      message: 'Unlock premium features and increase your usage limits',
    },
  } as const;

  const togglePopover = (action: 'add-group' | 'import' | 'export' | 'upgrade') => {
    setOpenPopover((prev) => (prev === action ? null : action));
  };

  const openColorSettings = (product: ProductRow) => {
    setSelectedProductId(product.id);
    setSettingsForm({
      lengthUnit: product.lengthUnit || 'mm',
      massUnit: product.weightUnit || 'kg',
      lengthAccuracy: product.lengthAccuracy || '5',
      rollPlacement: product.rollPlacement || 'square',
    });
    setIsColorSettingsOpen(true);
  };

  const closeColorSettings = () => {
    setIsColorSettingsOpen(false);
    setSelectedProductId(null);
  };

  const handleSaveSettings = () => {
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
              stack: settingsForm.rollPlacement === 'square' ? 'Square' : 'Hexagon',
            }
          : product,
      ),
    );

    closeColorSettings();
  };

  const renderPopover = (action: 'add-group' | 'import' | 'export' | 'upgrade') => {
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
          <span className="text-sm font-semibold text-gray-700">{content.title}</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-500">{content.badge}</span>
        </div>
        <div className="px-4 pt-2 text-xs font-semibold text-gray-500">
          Credit Used
          <span className="float-right text-sm text-gray-700">{content.used}</span>
        </div>
        <div className="mx-4 mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-medium text-red-500">
          {content.message}
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-blue-500 hover:text-blue-600"
        >
          Expand
          <span aria-hidden className="text-sm">
            ↗
          </span>
        </button>
      </div>
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

    const positions = placement === 'square' ? squarePositions : hexPositions;
    const bottomOffset = placement === 'square' ? 0 : 8;

    return (
      <svg viewBox="0 0 100 70" className="h-24 w-24" aria-hidden focusable="false">
        <defs>
          <linearGradient id={`cylinder-body-${placement}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dfe9fb" />
            <stop offset="100%" stopColor="#b9cff3" />
          </linearGradient>
        </defs>
        {positions.map((pos, index) => (
          <g key={`${placement}-${index}`} transform={`translate(${pos.x} ${pos.y + (index >= positions.length / 2 ? bottomOffset : 0)})`}>
            <ellipse cx="12" cy="5" rx="12" ry="5" fill="#eaf2ff" stroke="#8ab2ec" strokeWidth="0.8" />
            <rect
              x="0"
              y="5"
              width="24"
              height="26"
              fill={`url(#cylinder-body-${placement})`}
              stroke="#8ab2ec"
              strokeWidth="0.8"
            />
            <ellipse cx="12" cy="31" rx="12" ry="5" fill="#c2d7f5" stroke="#8ab2ec" strokeWidth="0.8" />
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
              onClick={() => setActiveTab('product')}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === 'product'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Product
            </button>
            <button
              onClick={() => setActiveTab('containers')}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === 'containers'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Containers & Trucks
            </button>
            <button
              onClick={() => setActiveTab('stuffing')}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                activeTab === 'stuffing'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Stuffing Result
            </button>
          </div>

          {/* Content */}
          {activeTab === 'product' && (
            <div className="p-6">
              {/* Action Buttons */}
              <div className="mb-6 flex items-center justify-between" ref={actionAreaRef}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePopover('add-group')}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Group
                  </button>
                  {openPopover === 'add-group' && renderPopover('add-group')}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover('import')}
                      className="flex items-center gap-2 rounded-lg border border-green-500 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
                    >
                      <FileDown className="h-4 w-4" />
                      Import
                    </button>
                    {openPopover === 'import' && renderPopover('import')}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover('export')}
                      className="flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <FileUp className="h-4 w-4" />
                      Export
                    </button>
                    {openPopover === 'export' && renderPopover('export')}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => togglePopover('upgrade')}
                      className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
                    >
                      Upgrade
                    </button>
                    {openPopover === 'upgrade' && renderPopover('upgrade')}
                  </div>
                </div>
              </div>

              {/* Group Header */}
              <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-gray-800"></div>
                  <span className="text-sm font-semibold text-gray-700">Group #1</span>
                  <button className="text-blue-500 hover:text-blue-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Product Name</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Length / Diameter</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Width</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Height</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Weight</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Quantity</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Color</th>
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Stack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr 
                        key={product.id} 
                        className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(`/dashboard/container-details/${product.id}`)}
                      >
                        <td className="px-3 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.productName}
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.lengthUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.length}
                              placeholder="Boxes 1"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.lengthUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.width}
                              placeholder="Boxes 1"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.widthUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.height}
                              placeholder="Boxes 1"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.heightUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.weight}
                              placeholder="Boxes 1"
                              className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.weightUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.quantity}
                              className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-xs text-gray-400">{product.quantityUnit}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-8 w-8 rounded-full border-2 border-gray-200 cursor-pointer"
                              style={{ backgroundColor: product.color }}
                            ></div>
                            <button
                              className="rounded-lg p-1 text-blue-500 hover:bg-blue-50"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openColorSettings(product);
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={product.stack}
                              placeholder="mm"
                              className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <button className="rounded-lg p-1 text-orange-500 hover:bg-orange-50">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Product Button */}
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={addProduct}
                  className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-600">
                  Use Pallet ?
                </button>
              </div>

              {/* Next Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setActiveTab('containers')}
                  className="rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === 'containers' && (
            <div className="p-6">
              {/* Action Buttons */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsContainerSelectionOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Container
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsContainerSelectionOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
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
                    onChange={(e) => setAutomaticContainerSelection(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="automatic-container" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Automatic Container Selection
                  </label>
                </div>
              </div>

              {/* Empty State */}
              {containers.length === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
                  {/* Transport Illustration */}
                  <div className="mb-6">
                    <svg viewBox="0 0 200 140" className="h-40 w-40">
                      <defs>
                        <linearGradient id="platformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#dbeafe" />
                          <stop offset="100%" stopColor="#bfdbfe" />
                        </linearGradient>
                        <linearGradient id="containerGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="containerGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <filter id="shadow">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                        </filter>
                      </defs>
                      
                      {/* Platform/Base */}
                      <ellipse cx="100" cy="120" rx="80" ry="12" fill="url(#platformGradient)" opacity="0.6" />
                      
                      {/* Container 1 (Back) */}
                      <g filter="url(#shadow)">
                        <path d="M 50 70 L 90 70 L 90 110 L 50 110 Z" fill="url(#containerGradient2)" stroke="#2563eb" strokeWidth="1.5" />
                        <path d="M 90 70 L 105 62 L 105 102 L 90 110 Z" fill="#1e40af" stroke="#2563eb" strokeWidth="1.5" />
                        <path d="M 50 70 L 90 70 L 105 62 L 65 62 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" />
                        {/* Container details */}
                        {[...Array(4)].map((_, i) => (
                          <line key={`c1-${i}`} x1={58 + i * 10} y1={75} x2={58 + i * 10} y2={105} stroke="#2563eb" strokeWidth="1" opacity="0.3" />
                        ))}
                      </g>
                      
                      {/* Container 2 (Front) */}
                      <g filter="url(#shadow)">
                        <path d="M 95 60 L 145 60 L 145 105 L 95 105 Z" fill="url(#containerGradient1)" stroke="#1d4ed8" strokeWidth="1.5" />
                        <path d="M 145 60 L 163 51 L 163 96 L 145 105 Z" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1.5" />
                        <path d="M 95 60 L 145 60 L 163 51 L 113 51 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1.5" />
                        {/* Container details */}
                        {[...Array(5)].map((_, i) => (
                          <line key={`c2-${i}`} x1={105 + i * 10} y1={65} x2={105 + i * 10} y2={100} stroke="#1d4ed8" strokeWidth="1" opacity="0.3" />
                        ))}
                        {/* Door handles */}
                        <circle cx="115" cy="82" r="2" fill="#1e3a8a" />
                        <circle cx="135" cy="82" r="2" fill="#1e3a8a" />
                      </g>
                      
                      {/* Accent elements */}
                      <circle cx="70" cy="115" r="3" fill="#3b82f6" opacity="0.6" />
                      <circle cx="120" cy="110" r="3" fill="#3b82f6" opacity="0.6" />
                    </svg>
                  </div>
                  
                  <p className="text-base font-medium text-gray-600">Please add transport</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setActiveTab('product')}
                  className="rounded-lg px-8 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveTab('stuffing')}
                  className="rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stuffing' && (
            <div className="p-6">
              <div className="py-20 text-center text-gray-500">
                <p className="text-lg font-medium">Stuffing Result</p>
                <p className="mt-2 text-sm">View your stuffing results here</p>
              </div>
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
                <h2 className="text-lg font-semibold text-gray-800">Color Stack Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure measurement units and roll placement for this product.
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
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  <span>Length Units</span>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={settingsForm.lengthUnit}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, lengthUnit: event.target.value }))
                    }
                  >
                    {LENGTH_UNITS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  <span>Mass Units</span>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={settingsForm.massUnit}
                    onChange={(event) =>
                      setSettingsForm((prev) => ({ ...prev, massUnit: event.target.value }))
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

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span>Length Accuracy</span>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none md:w-40"
                  value={settingsForm.lengthAccuracy}
                  onChange={(event) =>
                    setSettingsForm((prev) => ({ ...prev, lengthAccuracy: event.target.value }))
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
                <p className="text-sm font-medium text-gray-700">Roll Placement</p>
                <div className="mt-3 grid gap-6 md:grid-cols-2">
                  {(['square', 'hexagon'] as RollPlacement[]).map((placement) => {
                    const isActive = settingsForm.rollPlacement === placement;
                    return (
                      <label
                        key={placement}
                        className={`flex flex-col items-center rounded-2xl border px-6 py-6 text-center transition ${
                          isActive ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="roll-placement"
                          value={placement}
                          checked={isActive}
                          onChange={() =>
                            setSettingsForm((prev) => ({ ...prev, rollPlacement: placement }))
                          }
                          className="sr-only"
                        />
                        <CylinderIcon placement={placement} />
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                          <span
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                              isActive ? 'border-blue-500' : 'border-gray-300'
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isActive ? 'bg-blue-500' : 'bg-transparent'
                              }`}
                            ></span>
                          </span>
                          <span className="capitalize">{placement}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
                onClick={closeColorSettings}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                onClick={() => setIsCargoDesignOpen(true)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <CargoDesignModal isOpen={isCargoDesignOpen} onClose={() => setIsCargoDesignOpen(false)} />
      <ContainerSelectionModal 
        isOpen={isContainerSelectionOpen} 
        onClose={() => setIsContainerSelectionOpen(false)}
        onSelect={(containerType) => {
          setContainers((prev) => [...prev, { type: containerType, id: Date.now() }]);
          navigate(`/dashboard/container-details/${encodeURIComponent(containerType)}`);
        }}
      />
    </div>
  );
};

export default LoadCalculator;

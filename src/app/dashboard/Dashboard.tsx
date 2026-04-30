import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router';
import { getAllowedServices } from '../../services/authApi';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import FloatingSupport from '../../components/common/FloatingSupport';
import AddNewVehicle from '../../components/Domestraction transportiton/vehicle/AddNewVehicle';
import ManageVehicle from '../../components/Domestraction transportiton/vehicle/ManageVehicle';
import BulkUploadModal from '../../components/Domestraction transportiton/vehicle/BulkUploadModal';
import LoadCalculator from '../../components/Domestraction transportiton/vehicle/LoadCalculator';
import ContainerDetailsPage from '../../components/Domestraction transportiton/vehicle/ContainerDetailsPage';
import TripManagement from '../../components/Domestraction transportiton/trip/TripManagement';
import AccountTripsTable from '../../components/Domestraction transportiton/account/AccountTripsTable';
import ContactUsCard from '../../components/contact/ContactUsCard';
import AiAssistantPanel from '../../components/ai/AiAssistantPanel';
import CHAForm from '../../components/CHA/CHAForm';
import CHAOrders from '../../components/CHA/CHAOrders';
import WarehouseList from '../../components/warehouse/WarehouseList';
import WarehouseAccountTable from '../../components/warehouse/WarehouseAccountTable';
import WarehouseOrders from '../../components/warehouse/WarehouseOrders';
import WarehouseContact from '../../components/warehouse/WarehouseContact';
import FreightServiceForm from '../../components/freight/FreightServiceForm';
import FreightOrders from '../../components/freight/FreightOrders';
import FreightOrderDetails from '../../components/freight/FreightOrderDetails';
import FreightContact from '../../components/freight/FreightContact';
import InspectionForm from '../../components/profile/InspectionForm';
import InspectionResults from '../../components/inspection/InspectionResults';
import InspectionOrders from '../../components/inspection/InspectionOrders';
import InspectionOrderDetails from '../../components/inspection/InspectionOrderDetails';
import InspectionContact from '../../components/inspection/InspectionContact';
import ProfileForm from '../../components/profile/ProfileForm';
import BuyerPage from '../../components/buyer/BuyerPage';
import RailBuyerPage from '../../components/buyer/RailBuyerPage';
import AirBuyerPage from '../../components/buyer/AirBuyerPage';
import WaterBuyerPage from '../../components/buyer/WaterBuyerPage';
import BuyerDashboard from '../../components/buyer/BuyerDashboard';
import OrderSubmission from '../../components/order/OrderSubmission';
import InsuranceSelection from '../../components/order/InsuranceSelection';
import QuoteComparison from '../../components/order/QuoteComparison';
import { useBuyer } from '../../context/BuyerContext';

const ContainerDetailsRoute = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  return <ContainerDetailsPage containerId={productId ?? null} onBack={() => navigate(-1)} />;
};

const warehouseMenuIds = new Set([
  'manage-warehouse',
  'warehouse-account',
  'warehouse-order',
  'warehouse-buyer',
  'warehouse-contact-us',
  'warehouse-ai-assistant',
]);

const chaPrimaryMenuIds = new Set(['service', 'order', 'buyer']);
const inspectionMenuIds = new Set([
  'inspection-service',
  'inspection-order',
  'inspection-buyer',
  'inspection-contact',
  'inspection-ai',
]);
const freightMenuIds = new Set([
  'freight-service',
  'freight-order',
  'freight-buyer',
  'freight-contact',
  'freight-ai',
]);
const insuranceMenuIds = new Set([
  'insurance-service',
  'insurance-order',
  'insurance-contact',
  'insurance-ai',
]);

const getDefaultMenuForTab = (tab: string) => {
  if (tab === 'CHA') return 'service';
  if (tab === 'Warehouse') return 'manage-warehouse';
  if (tab === 'Freight Forwarding') return 'freight-service';
  if (tab === 'Inspection') return 'inspection-service';
  if (tab === 'Insurance') return 'insurance-service';
  return 'add-vehicle';
};

const Dashboard = () => {
  const allowedServices = useMemo(() => getAllowedServices(), []);
  const initialTab = allowedServices.length === 0
    ? 'Domestic Transportation'
    : (allowedServices.includes('Domestic Transportation')
        ? 'Domestic Transportation'
        : allowedServices[0]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isBuyerMode } = useBuyer();

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate(`/dashboard/${getDefaultMenuForTab(activeTab)}`, { replace: true });
    }
  }, [location.pathname, navigate, activeTab]);

  const currentMenu = location.pathname.startsWith('/dashboard/')
    ? location.pathname.replace('/dashboard/', '').split('/')[0]
    : getDefaultMenuForTab(activeTab);

  const resolveTabForMenu = (menu: string): string => {
    if (chaPrimaryMenuIds.has(menu)) return 'CHA';
    if (warehouseMenuIds.has(menu)) return 'Warehouse';
    if (freightMenuIds.has(menu)) return 'Freight Forwarding';
    if (inspectionMenuIds.has(menu)) return 'Inspection';
    if (insuranceMenuIds.has(menu)) return 'Insurance';
    return 'Domestic Transportation';
  };

  // Shared routes that don't belong to any one service (profile, global helpers).
  const PUBLIC_MENUS = new Set(['profile']);

  useEffect(() => {
    if (!currentMenu) return;
    localStorage.setItem('activeMenu', currentMenu);

    const tabForMenu = resolveTabForMenu(currentMenu);

    // Enforce allowedServices permission: if the user has a restricted
    // allowedServices list and the current URL resolves to a tab they don't
    // have, bounce them to the first service they DO have access to.
    // Empty allowedServices = admin / legacy user → no restriction.
    if (
      allowedServices.length > 0 &&
      !PUBLIC_MENUS.has(currentMenu) &&
      !allowedServices.includes(tabForMenu)
    ) {
      const fallbackTab = allowedServices.includes('Domestic Transportation')
        ? 'Domestic Transportation'
        : allowedServices[0];
      navigate(`/dashboard/${getDefaultMenuForTab(fallbackTab)}`, {
        replace: true,
      });
      return;
    }

    setActiveTab(tabForMenu);
  }, [currentMenu, allowedServices, navigate]);

  const handleMenuChange = (menuId: string) => {
    if (menuId !== currentMenu) {
      navigate(`/dashboard/${menuId}`);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to default menu for the selected tab
    navigate(`/dashboard/${getDefaultMenuForTab(tab)}`, { replace: true });
  };

  // Gate a route element behind a specific service permission. Admins and
  // legacy users (empty allowedServices) always pass through; restricted
  // users get redirected to their first allowed service.
  const guard = (service: string, element: React.ReactNode) => {
    if (allowedServices.length === 0) return element;
    if (allowedServices.includes(service)) return element;
    const fallbackTab = allowedServices.includes('Domestic Transportation')
      ? 'Domestic Transportation'
      : allowedServices[0];
    return (
      <Navigate
        to={`/dashboard/${getDefaultMenuForTab(fallbackTab)}`}
        replace
      />
    );
  };

  // If buyer mode is active, show the BuyerDashboard
  if (isBuyerMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BuyerDashboard />
        <FloatingSupport />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Left Sidebar - Unified sidebar with expandable service tabs */}
        <Sidebar
          activeMenu={currentMenu}
          onMenuChange={handleMenuChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="px-6 py-4">
            {/* Bulk Upload Button */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={() => setIsBulkUploadOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 underline"
              >
                Bulk Upload
              </button>
            </div>

            {/* Main Content Area - All Routes */}
            <Routes>
              {/* Domestic Transportation Routes */}
              <Route path="add-vehicle" element={guard('Domestic Transportation', <AddNewVehicle />)} />
              <Route path="manage-vehicle" element={guard('Domestic Transportation', <ManageVehicle />)} />
              <Route path="load-calculator" element={guard('Domestic Transportation', <LoadCalculator />)} />
              <Route path="container-details/:productId" element={guard('Domestic Transportation', <ContainerDetailsRoute />)} />
              <Route path="trip" element={guard('Domestic Transportation', <TripManagement />)} />
              <Route path="account" element={guard('Domestic Transportation', <AccountTripsTable />)} />
              <Route path="contact-us" element={guard('Domestic Transportation', <ContactUsCard />)} />
              <Route path="ai-assistant" element={guard('Domestic Transportation', <AiAssistantPanel />)} />
              <Route path="buyer" element={guard('Domestic Transportation', <BuyerPage title="Buyer" />)} />
              <Route path="rail-buyer" element={guard('Domestic Transportation', <RailBuyerPage />)} />
              <Route path="air-buyer" element={guard('Domestic Transportation', <AirBuyerPage />)} />
              <Route path="water-buyer" element={guard('Domestic Transportation', <WaterBuyerPage />)} />
              <Route path="order-submission" element={guard('Domestic Transportation', <OrderSubmission />)} />
              <Route path="insurance-selection" element={guard('Domestic Transportation', <InsuranceSelection />)} />
              <Route path="quote-comparison" element={guard('Domestic Transportation', <QuoteComparison />)} />

              {/* CHA Routes */}
              <Route path="service" element={guard('CHA', <CHAForm />)} />
              <Route path="order" element={guard('CHA', <CHAOrders />)} />

              {/* Warehouse Routes */}
              <Route path="manage-warehouse" element={guard('Warehouse', <WarehouseList />)} />
              <Route path="warehouse-account" element={guard('Warehouse', <WarehouseAccountTable />)} />
              <Route path="warehouse-order" element={guard('Warehouse', <WarehouseOrders />)} />
              <Route path="warehouse-buyer" element={guard('Warehouse', <BuyerPage title="Warehouse buyer" />)} />
              <Route path="warehouse-contact-us" element={guard('Warehouse', <WarehouseContact />)} />
              <Route path="warehouse-ai-assistant" element={guard('Warehouse', <AiAssistantPanel />)} />

              {/* Freight Forwarding Routes */}
              <Route path="freight-service" element={guard('Freight Forwarding', <FreightServiceForm />)} />
              <Route path="freight-order" element={guard('Freight Forwarding', <FreightOrders />)} />
              <Route path="freight-order/:orderId" element={guard('Freight Forwarding', <FreightOrderDetails />)} />
              <Route path="freight-buyer" element={guard('Freight Forwarding', <BuyerPage title="Freight buyer" />)} />
              <Route path="freight-contact" element={guard('Freight Forwarding', <FreightContact />)} />
              <Route path="freight-ai" element={guard('Freight Forwarding', <AiAssistantPanel />)} />

              {/* Inspection Routes */}
              <Route path="inspection-service" element={guard('Inspection', <InspectionResults />)} />
              <Route path="inspection-service/form" element={guard('Inspection', <InspectionForm />)} />
              <Route path="inspection-order" element={guard('Inspection', <InspectionOrders />)} />
              <Route path="inspection-order/:orderId" element={guard('Inspection', <InspectionOrderDetails />)} />
              <Route path="inspection-buyer" element={guard('Inspection', <BuyerPage title="Inspection buyer" />)} />
              <Route path="inspection-contact" element={guard('Inspection', <InspectionContact />)} />
              <Route path="inspection-ai" element={guard('Inspection', <AiAssistantPanel />)} />

              {/* Insurance Routes */}
              <Route path="insurance-service" element={guard('Insurance', <InsuranceSelection />)} />
              <Route path="insurance-order" element={guard('Insurance', <OrderSubmission />)} />
              <Route path="insurance-contact" element={guard('Insurance', <ContactUsCard />)} />
              <Route path="insurance-ai" element={guard('Insurance', <AiAssistantPanel />)} />

              {/* Profile Route (without submit button) */}
              <Route path="profile" element={<ProfileForm />} />

              {/* Default Route */}
              <Route
                path="*"
                element={
                  allowedServices.length > 0 && !allowedServices.some((svc) =>
                    [activeTab].includes(svc),
                  ) ? (
                    <Navigate to={`/dashboard/${getDefaultMenuForTab(initialTab)}`} replace />
                  ) : (
                    <div className="py-20 text-center text-gray-500">
                      Select an option from the sidebar
                    </div>
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
      <FloatingSupport />

      {/* Bulk Upload Modal */}
      <BulkUploadModal isOpen={isBulkUploadOpen} onClose={() => setIsBulkUploadOpen(false)} />
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
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
import InspectionForm from '../../components/inspection/InspectionForm';
import InspectionResults from '../../components/inspection/InspectionResults';
import InspectionOrders from '../../components/inspection/InspectionOrders';
import InspectionOrderDetails from '../../components/inspection/InspectionOrderDetails';
import InspectionContact from '../../components/inspection/InspectionContact';
import ProfileForm from '../../components/profile/ProfileForm';
import BuyerPage from '../../components/buyer/BuyerPage';
import RailBuyerPage from '../../components/buyer/RailBuyerPage';
import AirBuyerPage from '../../components/buyer/AirBuyerPage';
import WaterBuyerPage from '../../components/buyer/WaterBuyerPage';
import OrderSubmission from '../../components/order/OrderSubmission';
import InsuranceSelection from '../../components/order/InsuranceSelection';
import QuoteComparison from '../../components/order/QuoteComparison';

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
  const [activeTab, setActiveTab] = useState('Domestic Transportation');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate(`/dashboard/${getDefaultMenuForTab(activeTab)}`, { replace: true });
    }
  }, [location.pathname, navigate, activeTab]);

  const currentMenu = location.pathname.startsWith('/dashboard/')
    ? location.pathname.replace('/dashboard/', '').split('/')[0]
    : getDefaultMenuForTab(activeTab);

  useEffect(() => {
    if (currentMenu) {
      localStorage.setItem('activeMenu', currentMenu);
      
      // Update activeTab based on current menu
      if (chaPrimaryMenuIds.has(currentMenu)) {
        setActiveTab('CHA');
      } else if (warehouseMenuIds.has(currentMenu)) {
        setActiveTab('Warehouse');
      } else if (freightMenuIds.has(currentMenu)) {
        setActiveTab('Freight Forwarding');
      } else if (inspectionMenuIds.has(currentMenu)) {
        setActiveTab('Inspection');
      } else if (insuranceMenuIds.has(currentMenu)) {
        setActiveTab('Insurance');
      } else {
        setActiveTab('Domestic Transportation');
      }
    }
  }, [currentMenu]);

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
              <Route path="add-vehicle" element={<AddNewVehicle />} />
              <Route path="manage-vehicle" element={<ManageVehicle />} />
              <Route path="load-calculator" element={<LoadCalculator />} />
              <Route path="container-details/:productId" element={<ContainerDetailsPage />} />
              <Route path="trip" element={<TripManagement />} />
              <Route path="account" element={<AccountTripsTable />} />
              <Route path="contact-us" element={<ContactUsCard />} />
              <Route path="ai-assistant" element={<AiAssistantPanel />} />
              <Route path="buyer" element={<BuyerPage title="Buyer" />} />
              <Route path="rail-buyer" element={<RailBuyerPage />} />
              <Route path="air-buyer" element={<AirBuyerPage />} />
              <Route path="water-buyer" element={<WaterBuyerPage />} />
              <Route path="order-submission" element={<OrderSubmission />} />
              <Route path="insurance-selection" element={<InsuranceSelection />} />
              <Route path="quote-comparison" element={<QuoteComparison />} />

              {/* CHA Routes */}
              <Route path="service" element={<CHAForm />} />
              <Route path="order" element={<CHAOrders />} />

              {/* Warehouse Routes */}
              <Route path="manage-warehouse" element={<WarehouseList />} />
              <Route path="warehouse-account" element={<WarehouseAccountTable />} />
              <Route path="warehouse-order" element={<WarehouseOrders />} />
              <Route path="warehouse-buyer" element={<BuyerPage title="Warehouse buyer" />} />
              <Route path="warehouse-contact-us" element={<WarehouseContact />} />
              <Route path="warehouse-ai-assistant" element={<AiAssistantPanel />} />

              {/* Freight Forwarding Routes */}
              <Route path="freight-service" element={<FreightServiceForm />} />
              <Route path="freight-order" element={<FreightOrders />} />
              <Route path="freight-order/:orderId" element={<FreightOrderDetails />} />
              <Route path="freight-buyer" element={<BuyerPage title="Freight buyer" />} />
              <Route path="freight-contact" element={<FreightContact />} />
              <Route path="freight-ai" element={<AiAssistantPanel />} />

              {/* Inspection Routes */}
              <Route path="inspection-service" element={<InspectionResults />} />
              <Route path="inspection-service/form" element={<InspectionForm />} />
              <Route path="inspection-order" element={<InspectionOrders />} />
              <Route path="inspection-order/:orderId" element={<InspectionOrderDetails />} />
              <Route path="inspection-buyer" element={<BuyerPage title="Inspection buyer" />} />
              <Route path="inspection-contact" element={<InspectionContact />} />
              <Route path="inspection-ai" element={<AiAssistantPanel />} />

              {/* Insurance Routes */}
              <Route path="insurance-service" element={<InsuranceSelection />} />
              <Route path="insurance-order" element={<OrderSubmission />} />
              <Route path="insurance-contact" element={<ContactUsCard />} />
              <Route path="insurance-ai" element={<AiAssistantPanel />} />

              {/* Profile Route (without submit button) */}
              <Route path="profile" element={<ProfileForm />} />

              {/* Default Route */}
              <Route
                path="*"
                element={
                  <div className="py-20 text-center text-gray-500">
                    Select an option from the sidebar
                  </div>
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

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import CHASidebar from '../../components/dashboard/CHASidebar';
import WarehouseSidebar from '../../components/dashboard/WarehouseSidebar';
import ServiceTabs from '../../components/dashboard/ServiceTabs';
import FloatingSupport from '../../components/common/FloatingSupport';
import AddNewVehicle from '../../components/Domestraction transportiton/vehicle/AddNewVehicle';
import ManageVehicle from '../../components/Domestraction transportiton/vehicle/ManageVehicle';
import BulkUploadModal from '../../components/Domestraction transportiton/vehicle/BulkUploadModal';
import TripManagement from '../../components/Domestraction transportiton/trip/TripManagement';
import AccountTripsTable from '../../components/Domestraction transportiton/account/AccountTripsTable';
import ContactUsCard from '../../components/contact/ContactUsCard';
import AiAssistantPanel from '../../components/ai/AiAssistantPanel';
import CHAForm from '../../components/CHA/CHAForm';
import CHAOrders from '../../components/CHA/CHAOrders';
import WarehouseFacilities from '../../components/warehouse/WarehouseFacilities';
import WarehouseAccountTable from '../../components/warehouse/WarehouseAccountTable';
import WarehouseOrders from '../../components/warehouse/WarehouseOrders';

const warehouseMenuIds = new Set([
  'manage-warehouse',
  'warehouse-account',
  'warehouse-order',
  'warehouse-contact-us',
  'warehouse-ai-assistant',
]);

const chaPrimaryMenuIds = new Set(['service', 'order']);

const getDefaultMenuForTab = (tab: string) => {
  if (tab === 'CHA') return 'service';
  if (tab === 'Warehouse') return 'manage-warehouse';
  return 'add-vehicle';
};

const WarehousePlaceholder = ({ title }: { title: string }) => (
  <div className="py-20 text-center text-gray-500">{title} page coming soon</div>
);

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
    }
  }, [currentMenu]);

  const handleMenuChange = (menuId: string) => {
    if (menuId !== currentMenu) {
      navigate(`/dashboard/${menuId}`);
    }
  };

  // Navigate to service when CHA tab is selected (only if not already on a CHA route)
  useEffect(() => {
    if (activeTab === 'CHA') {
      // Only navigate to service if we're not already on a CHA-specific route
      if (!chaPrimaryMenuIds.has(currentMenu) && currentMenu !== 'contact-us' && currentMenu !== 'ai-assistant') {
        navigate('/dashboard/service', { replace: true });
      }
    } else if (activeTab === 'Warehouse') {
      if (!warehouseMenuIds.has(currentMenu)) {
        navigate('/dashboard/manage-warehouse', { replace: true });
      }
    } else if (activeTab === 'Domestic Transportation') {
      // Navigate to add-vehicle for Domestic Transportation
      if (warehouseMenuIds.has(currentMenu) || chaPrimaryMenuIds.has(currentMenu)) {
        navigate('/dashboard/add-vehicle', { replace: true });
      }
    }
  }, [activeTab, navigate, currentMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Left Sidebar - Conditionally render based on active tab */}
        {activeTab === 'CHA' ? (
          <CHASidebar activeMenu={currentMenu} onMenuChange={handleMenuChange} />
        ) : activeTab === 'Warehouse' ? (
          <WarehouseSidebar activeMenu={currentMenu} onMenuChange={handleMenuChange} />
        ) : (
          <Sidebar activeMenu={currentMenu} onMenuChange={handleMenuChange} />
        )}
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="px-6 py-4">
            {/* Service Tabs and Bulk Upload */}
            <div className="flex items-center justify-between mb-6">
              <ServiceTabs 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  setActiveTab(tab);
                }} 
              />
              <button 
                onClick={() => setIsBulkUploadOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 underline"
              >
                Bulk Upload
              </button>
            </div>
            
            {/* Main Content Area */}
            {activeTab === 'Warehouse' ? (
              <Routes>
                <Route path="manage-warehouse" element={<WarehouseFacilities />} />
                <Route path="warehouse-account" element={<WarehouseAccountTable />} />
                <Route path="warehouse-order" element={<WarehouseOrders />} />
                <Route path="warehouse-contact-us" element={<WarehousePlaceholder title="Warehouse contact" />} />
                <Route path="warehouse-ai-assistant" element={<WarehousePlaceholder title="Warehouse AI assistant" />} />
                <Route path="*" element={<Navigate to="/dashboard/manage-warehouse" replace />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="add-vehicle" element={<AddNewVehicle />} />
                <Route path="manage-vehicle" element={<ManageVehicle />} />
                <Route path="trip" element={<TripManagement />} />
                <Route path="account" element={<AccountTripsTable />} />
                <Route path="contact-us" element={<ContactUsCard />} />
                <Route path="ai-assistant" element={<AiAssistantPanel />} />
                {/* CHA Routes */}
                <Route path="service" element={<CHAForm />} />
                <Route path="order" element={<CHAOrders />} />
                <Route
                  path="*"
                  element={
                    <div className="py-20 text-center text-gray-500">
                      Select an option from the sidebar
                    </div>
                  }
                />
              </Routes>
            )}
          </div>
        </div>
      </div>
      <FloatingSupport />
      
      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;

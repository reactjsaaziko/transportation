import { User, Plus, Calculator, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Navigate to profile form (without submit button)
    navigate('/dashboard/profile');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home Button */}
          <div className="flex items-center gap-4">
            <img 
              src="/images/logo.png" 
              alt="Aaziko Logo" 
              className="h-10 w-auto"
            />
            
            {/* Home Button */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* User/Profile Icon - Opens Inspection Form */}
            <button 
              onClick={handleProfileClick}
              className="p-2 hover:bg-blue-50 rounded-full transition-colors group relative"
              title="Inspection Service"
            >
              <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>

            {/* Load Calculator Button */}
            <button 
              onClick={() => navigate('/dashboard/load-calculator')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              <span className="text-sm font-medium">Load Calculator</span>
            </button>

            {/* Create Ticket Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">Create Ticket</span>
              <Plus className="w-4 h-4 text-gray-600" />
            </button>

            {/* Country Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-sm font-medium text-gray-700">India</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <span className="text-sm font-medium text-gray-700">Select Language</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

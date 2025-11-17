import { User, Plus } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Aaziko Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* User Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-600" />
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

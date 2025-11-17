import { X, Upload } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  if (!isOpen) return null;

  const handleFileSelect = () => {
    // Handle file selection logic
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Selected file:', file.name);
        // Handle file upload logic here
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    // Handle template download logic
    console.log('Downloading template...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Here You Can Upload Multiple Vehicle and manage all.
          </h2>

          <div className="mt-6 space-y-4">
            {/* Select File Button */}
            <button
              onClick={handleFileSelect}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              Select File
            </button>

            {/* Download Template Link */}
            <button
              onClick={handleDownloadTemplate}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Download template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;

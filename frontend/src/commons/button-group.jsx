import { useEffect, useState } from "react";

export default function ApprovalBtn({class_Name, options, on_pressed, current, regID}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(current)

  // Determine button color based on current status
  const getButtonStyle = (status) => {
    status = typeof status === "boolean" ? "pending":status;
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'disapproved':
        return 'bg-red-500 hover:bg-red-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  useEffect(() => {
    setSelectedStatus(current);
  }, [current])

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-1.5 text-white rounded-md ${getButtonStyle(selectedStatus)} transition-colors duration-200`}
      >
        <span className="capitalize">{selectedStatus}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {options.map((o, idx) => (
              <li 
                key={idx} 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm transition-colors duration-150"
                onClick={() => {
                  setSelectedStatus(o.params);
                  on_pressed(regID, o.params);
                  setIsOpen(false);
                }}
              >
                {o.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

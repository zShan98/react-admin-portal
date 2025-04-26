import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FilterDropdown({ 
  selected, 
  options = [], 
  onChange, 
  placeholder = "Select option",
  width,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const checkPosition = () => {
      if (dropdownRef.current && listRef.current) {
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const listHeight = listRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - dropdownRect.bottom;
        
        setOpenAbove(spaceBelow < listHeight && dropdownRect.top > listHeight);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (isOpen) {
      checkPosition();
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button" // Add this to prevent form submission
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          e.stopPropagation(); // Stop event bubbling
          setIsOpen(!isOpen);
        }}
        className={cn(width ? `w-${width}` : null, "w-full flex justify-between items-center gap-2 bg-secondary-background px-4 py-2 rounded-lg text-font-gray-secondary hover:bg-opacity-90 transition-colors")}
      >
        {selected || placeholder}
        <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          ref={listRef}
          className={`overflow-y-auto max-h-[400px] absolute ${openAbove ? 'bottom-12' : 'top-12'} right-0 w-full bg-white rounded-lg shadow-lg py-2 z-1000`}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                e.stopPropagation(); // Stop event bubbling
                handleSelect(option);
              }}
              className={`px-4 py-2 hover:bg-secondary-background cursor-pointer transition-colors
                ${selected === option ? 'bg-secondary-background' : ''}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
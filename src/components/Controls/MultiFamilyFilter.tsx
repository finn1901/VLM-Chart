import { useState, useRef, useEffect } from 'react';
import './MultiFamilyFilter.css';

interface MultiFamilyFilterProps {
  families: string[];
  selectedFamilies: string[];
  onFamiliesChange: (families: string[]) => void;
}

/**
 * Multi-select dropdown for filtering by model families
 * Allows selecting multiple families with checkboxes
 */
export const MultiFamilyFilter = ({ families, selectedFamilies, onFamiliesChange }: MultiFamilyFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter out 'all' from the families list
  const selectableFamilies = families.filter((f) => f !== 'all');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFamilyToggle = (family: string) => {
    if (selectedFamilies.includes(family)) {
      // Remove family
      const newSelection = selectedFamilies.filter((f) => f !== family);
      onFamiliesChange(newSelection.length === 0 ? ['all'] : newSelection);
    } else {
      // Add family (remove 'all' if present)
      const newSelection = selectedFamilies.filter((f) => f !== 'all');
      onFamiliesChange([...newSelection, family]);
    }
  };

  const handleSelectAll = () => {
    onFamiliesChange(['all']);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    onFamiliesChange(['all']);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getButtonLabel = () => {
    if (selectedFamilies.includes('all') || selectedFamilies.length === 0) {
      return 'All families';
    }
    if (selectedFamilies.length === 1) {
      return selectedFamilies[0];
    }
    return `${selectedFamilies.length} families`;
  };

  return (
    <div className="multi-family-filter" ref={dropdownRef}>
      <label className="control-label" htmlFor="family-filter-button">
        Filter by family
      </label>
      <button
        id="family-filter-button"
        className="multi-family-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{getButtonLabel()}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="8"
          viewBox="0 0 12 8"
        >
          <path fill="currentColor" d="M1.41.59 6 5.17 10.59.59 12 2l-6 6-6-6z" />
        </svg>
      </button>

      {isOpen && (
        <div className="multi-family-dropdown" role="listbox">
          <div className="dropdown-header">
            <button className="dropdown-action-btn" onClick={handleSelectAll}>
              Select All
            </button>
            <button className="dropdown-action-btn" onClick={handleClearAll}>
              Clear
            </button>
          </div>
          <div className="dropdown-items">
            {selectableFamilies.map((family) => (
              <label key={family} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedFamilies.includes(family)}
                  onChange={() => handleFamilyToggle(family)}
                  className="family-checkbox"
                />
                <span className="family-label">{family}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { useState, useCallback } from 'react';
import type { ProcessedDataPoint } from '../../types';
import { downloadCSV } from '../../utils/csvExport';
import './ExportButton.css';

interface ExportButtonProps {
  data: ProcessedDataPoint[];
  filename?: string;
  className?: string;
}

/**
 * Button component to export filtered data as CSV
 * Shows success feedback after exporting
 */
export const ExportButton = ({ data, filename = 'vlm-models.csv', className = '' }: ExportButtonProps) => {
  const [exported, setExported] = useState(false);

  const handleExport = useCallback(() => {
    if (data.length === 0) {
      return;
    }

    downloadCSV(data, filename);
    setExported(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setExported(false);
    }, 2000);
  }, [data, filename]);

  const isDisabled = data.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`export-button ${className} ${isDisabled ? 'disabled' : ''}`}
      title={isDisabled ? 'No data to export' : `Export ${data.length} models to CSV`}
    >
      {exported ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Exported!</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export CSV</span>
        </>
      )}
    </button>
  );
};

import { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import type { ProcessedDataPoint } from '../../types';
import { downloadCSV } from '../../utils/csvExport';
import './ExportChartButton.css';

interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLElement>;
  data: ProcessedDataPoint[];
  filename?: string;
}

/**
 * Unified export button for chart (PNG/SVG) and data (CSV)
 */
export const ExportChartButton = ({ chartRef, data, filename = 'vlm-chart' }: ExportChartButtonProps) => {
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [exported, setExported] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = useCallback(async () => {
    if (!chartRef.current || exporting) return;

    setExporting(true);
    setShowMenu(false);

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor:
          getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export chart as PNG:', error);
      alert('Failed to export chart. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [chartRef, filename, exporting]);

  const handleExportSVG = useCallback(async () => {
    if (!chartRef.current || exporting) return;

    setExporting(true);
    setShowMenu(false);

    try {
      // Find the SVG element within the chart
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found in chart');
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Get computed styles and apply them inline
      const styleSheets = Array.from(document.styleSheets);
      let cssText = '';

      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules);
          rules.forEach((rule) => {
            cssText += rule.cssText + '\n';
          });
        } catch (e) {
          // Skip stylesheets that can't be accessed due to CORS
        }
      });

      // Add styles to SVG
      const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleElement.textContent = cssText;
      clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

      // Convert to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // Create blob and download
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export chart as SVG:', error);
      alert('Failed to export chart as SVG. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [chartRef, filename, exporting]);

  const handleExportCSV = useCallback(() => {
    if (data.length === 0) return;

    setShowMenu(false);
    downloadCSV(data, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    setExported(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setExported(false);
    }, 2000);
  }, [data, filename]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const buttonText = exporting ? 'Exporting...' : exported ? 'Exported!' : 'Export';

  return (
    <div className="export-chart-wrapper" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="export-chart-button"
        title="Export chart or data"
        disabled={exporting}
      >
        {exported ? (
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
        ) : (
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
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        )}
        <span>{buttonText}</span>
      </button>

      {showMenu && !exporting && (
        <div className="export-chart-menu">
          <div className="export-menu-section">
            <div className="export-menu-label">Chart</div>
            <button onClick={handleExportPNG} className="export-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>PNG Image</span>
            </button>
            <button onClick={handleExportSVG} className="export-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span>SVG Vector</span>
            </button>
          </div>
          <div className="export-menu-divider"></div>
          <div className="export-menu-section">
            <div className="export-menu-label">Data</div>
            <button
              onClick={handleExportCSV}
              className="export-menu-item"
              disabled={data.length === 0}
              title={data.length === 0 ? 'No data to export' : `Export ${data.length} models`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>CSV Spreadsheet ({data.length} models)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

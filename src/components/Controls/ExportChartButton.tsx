import { useState, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import './ExportChartButton.css';

interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLElement>;
  filename?: string;
}

/**
 * Button to export the chart as PNG or SVG image
 */
export const ExportChartButton = ({ chartRef, filename = 'vlm-chart' }: ExportChartButtonProps) => {
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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

  // Close menu when clicking outside
  useCallback(() => {
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

  return (
    <div className="export-chart-wrapper" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="export-chart-button"
        title="Export chart as image"
        disabled={exporting}
      >
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
        <span>{exporting ? 'Exporting...' : 'Export Chart'}</span>
      </button>

      {showMenu && !exporting && (
        <div className="export-chart-menu">
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
            <span>Export as PNG</span>
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
            <span>Export as SVG</span>
          </button>
        </div>
      )}
    </div>
  );
};

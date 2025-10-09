import type { ProcessedDataPoint } from '../types';

/**
 * Converts an array of model data to CSV format
 * @param data - Array of processed data points
 * @returns CSV string
 */
export const convertToCSV = (data: ProcessedDataPoint[]): string => {
  if (data.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = ['Model Name', 'Family', 'Benchmark Score', 'Parameters (B)', 'Release Date'];

  // Convert data rows
  const rows = data.map((model) => [
    `"${model.name}"`, // Wrap in quotes to handle commas in names
    `"${model.family}"`,
    model.score.toString(),
    model.params.toString(),
    model.date.toLocaleDateString('en-US'),
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csvContent;
};

/**
 * Triggers a download of the CSV file
 * @param data - Array of processed data points
 * @param filename - Name of the file to download
 */
export const downloadCSV = (data: ProcessedDataPoint[], filename: string = 'vlm-models.csv'): void => {
  const csvContent = convertToCSV(data);

  if (!csvContent) {
    console.warn('No data to export');
    return;
  }

  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};

import type { ProcessedDataPoint } from '../../types';

interface CustomTooltipProps {
  selectedModel: string | null;
  processedData: ProcessedDataPoint[];
}

export const CustomTooltip = ({ selectedModel, processedData }: CustomTooltipProps) => {
  if (!selectedModel) {
    return null;
  }

  const dataPoint = processedData.find((d) => d.name === selectedModel);
  if (!dataPoint) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-elevated)',
        padding: '10px 12px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 12px 28px -18px rgba(2, 6, 23, 0.7)',
        color: 'var(--text-primary)',
      }}
    >
      <p style={{ fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>{dataPoint.name}</p>
      <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>Score: {dataPoint.score}</p>
      <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>Parameters: {dataPoint.params}B</p>
      <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>Date: {dataPoint.date.toLocaleDateString()}</p>
      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Family: {dataPoint.family}</p>
    </div>
  );
};

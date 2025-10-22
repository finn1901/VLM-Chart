import type { ProcessedDataPoint, BenchmarkName } from '../../types';
import { BENCHMARK_INFO } from '../../utils/weightedScoring';

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

  const benchmarkNames = Object.keys(dataPoint.benchmarks) as BenchmarkName[];

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-elevated)',
        padding: '12px 14px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 12px 28px -18px rgba(2, 6, 23, 0.7)',
        color: 'var(--text-primary)',
        maxWidth: '320px',
      }}
    >
      <p style={{ fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '15px' }}>
        {dataPoint.name}
      </p>
      <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <strong>Weighted Score:</strong> {dataPoint.score.toFixed(1)}
      </p>
      <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <strong>Parameters:</strong> {dataPoint.params}B
        {dataPoint.paramsEstimated && (
          <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#e6b800', marginLeft: '4px' }}>
            (estimated)
          </span>
        )}
      </p>
      <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <strong>Date:</strong> {dataPoint.date.toLocaleDateString()}
      </p>
      <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        <strong>Family:</strong> {dataPoint.family}
      </p>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px' }}>
        <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
          Benchmark Scores:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px' }}>
          {benchmarkNames.map((benchmark) => {
            const info = BENCHMARK_INFO[benchmark];
            return (
              <div
                key={benchmark}
                style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}
              >
                <span>{info.name}:</span>
                <span style={{ fontWeight: 500, marginLeft: '8px' }}>{dataPoint.benchmarks[benchmark].toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

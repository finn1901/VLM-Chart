import { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ZAxis } from 'recharts';
import type { ProcessedDataPoint, ScatterShapeProps } from '../../types';
import { FAMILY_COLORS, BUBBLE_SIZE, CHART_MARGINS, Y_AXIS_CONFIG } from '../../constants/chartConfig';
import { ModelDetailsPanel } from './ModelDetailsPanel';

interface BubbleChartProps {
  processedData: ProcessedDataPoint[];
  availableFamilies: string[];
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  comparisonMode?: boolean;
  comparedModels?: string[];
  onToggleComparison?: (modelName: string) => void;
}

export const BubbleChart = ({
  processedData,
  availableFamilies,
  selectedModel,
  onModelSelect,
  comparisonMode = false,
  comparedModels = [],
  onToggleComparison,
}: BubbleChartProps) => {
  const scores = processedData.map((d) => d.score);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 100;
  const yAxisUpperBound =
    Math.ceil((highestScore + Y_AXIS_CONFIG.PADDING) / Y_AXIS_CONFIG.PADDING) * Y_AXIS_CONFIG.PADDING;

  const yAxisTicks: number[] = [];
  for (let tick = 0; tick <= yAxisUpperBound; tick += Y_AXIS_CONFIG.TICK_INTERVAL) {
    yAxisTicks.push(tick);
  }
  if (yAxisTicks[yAxisTicks.length - 1] !== yAxisUpperBound) {
    yAxisTicks.push(yAxisUpperBound);
  }

  const paramValues = processedData.map((d) => Math.max(d.params, 0));
  const hasParams = paramValues.length > 0;
  const minParams = hasParams ? Math.min(...paramValues) : 0;
  const maxParams = hasParams ? Math.max(...paramValues) : 0;

  const zDomain = useMemo<[number, number]>(() => {
    if (!hasParams) {
      return [0, 1];
    }
    if (minParams === maxParams) {
      const upper = maxParams === 0 ? 1 : maxParams;
      return [0, upper];
    }
    return [minParams, maxParams];
  }, [hasParams, maxParams, minParams]);

  const selectedModelData = useMemo(() => {
    if (!selectedModel) return null;
    return processedData.find((d) => d.name === selectedModel) || null;
  }, [selectedModel, processedData]);

  return (
    <>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={CHART_MARGINS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) =>
                new Date(timestamp).toLocaleDateString('en-US', {
                  year: '2-digit',
                  month: 'short',
                })
              }
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              label={{
                value: 'Date of benchmarking',
                position: 'insideBottom',
                offset: -10,
                fill: 'var(--text-secondary)',
                style: { fontSize: 13 },
              }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[0, yAxisUpperBound]}
              ticks={yAxisTicks}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              label={{
                value: 'Benchmark score',
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--text-secondary)',
                style: { fontSize: 13 },
              }}
            />
            <ZAxis dataKey="z" type="number" domain={zDomain} range={[BUBBLE_SIZE.MIN, BUBBLE_SIZE.MAX]} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 20, color: 'var(--text-secondary)' }}
              iconType="circle"
            />

            {availableFamilies.map((family) => {
              const familyData = processedData.filter((d) => d.family === family);
              if (familyData.length === 0) return null;

              return (
                <Scatter
                  key={family}
                  name={family}
                  data={familyData}
                  fill={FAMILY_COLORS[family]}
                  onClick={(data) => {
                    if (comparisonMode && onToggleComparison) {
                      onToggleComparison(data.name);
                    } else {
                      onModelSelect(data.name);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  shape={(props: ScatterShapeProps) => {
                    const isSelected = props.payload?.name === selectedModel;
                    const isCompared = comparedModels.includes(props.payload?.name || '');
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={props.payload?.z ? Math.sqrt(props.payload.z) : 5}
                        fill={props.fill}
                        fillOpacity={isSelected || isCompared ? 1 : 0.65}
                        stroke={isSelected ? '#fff' : isCompared ? '#3b82f6' : 'none'}
                        strokeWidth={isSelected || isCompared ? 3 : 0}
                      />
                    );
                  }}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ModelDetailsPanel model={selectedModelData} onClose={() => onModelSelect('')} />
    </>
  );
};

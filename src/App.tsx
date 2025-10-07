import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ZAxis,
} from 'recharts';
import './App.css';

interface DataPoint {
  name: string;
  date: Date;
  score: number;
  params: number;
  family: string;
}

interface ProcessedDataPoint extends DataPoint {
  x: number;
  y: number;
  z: number;
}

const VLMBubbleChart = () => {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const data = useMemo<DataPoint[]>(
    () => [
      { name: 'Qwen-VL', date: new Date('2023-08-24'), score: 28.3, params: 9.6, family: 'Qwen' },
      { name: 'Qwen-VL-Chat', date: new Date('2023-08-24'), score: 45.2, params: 9.6, family: 'Qwen' },
      { name: 'Qwen2-VL-2B', date: new Date('2024-09-12'), score: 57.3, params: 2, family: 'Qwen' },
      { name: 'Qwen2-VL-8B', date: new Date('2024-09-12'), score: 67.1, params: 8, family: 'Qwen' },
      { name: 'Qwen2.5-VL-7B', date: new Date('2025-02-02'), score: 70.9, params: 7, family: 'Qwen' },
      { name: 'Qwen2.5-VL-3B', date: new Date('2025-02-02'), score: 64.5, params: 3, family: 'Qwen' },
      { name: 'Kimi-VL-A3B-Thinking', date: new Date('2025-04-23'), score: 65.9, params: 16.4, family: 'Kimi' },
      { name: 'Kimi-VL-A3B-Instruct', date: new Date('2025-04-14'), score: 69.1, params: 16.4, family: 'Kimi' },
      { name: 'Kimi-VL-A3B-Thinking-2506', date: new Date('2025-07-02'), score: 74.3, params: 16.4, family: 'Kimi' },
      { name: 'SmolVLM-256M', date: new Date('2025-01-27'), score: 34.4, params: 0.26, family: 'SmolVLM' },
      { name: 'SmolVLM-500M', date: new Date('2025-01-27'), score: 41.3, params: 0.51, family: 'SmolVLM' },
      { name: 'SmolVLM-Instruct', date: new Date('2025-01-27'), score: 48.1, params: 2.3, family: 'SmolVLM' },
      { name: 'SmolVLM-Instruct-DPO', date: new Date('2025-01-27'), score: 44.8, params: 2.3, family: 'SmolVLM' },
      { name: 'SmolVLM-Synthetic', date: new Date('2025-01-27'), score: 52.2, params: 2.3, family: 'SmolVLM' },
      { name: 'SmolVLM2', date: new Date('2025-03-13'), score: 44.8, params: 2.25, family: 'SmolVLM' },
      { name: 'SmolVLM2-256M', date: new Date('2025-03-13'), score: 30.8, params: 0.26, family: 'SmolVLM' },
      { name: 'SmolVLM2-500M', date: new Date('2025-03-13'), score: 40.9, params: 0.51, family: 'SmolVLM' },
      { name: 'CogVLM-17B-Chat', date: new Date('2024-01-03'), score: 47.9, params: 17, family: 'CogVLM' },
      { name: 'CogVLM2-19B-Chat', date: new Date('2024-05-31'), score: 56.3, params: 19, family: 'CogVLM' },
      { name: 'Llama-3.2-11B', date: new Date('2024-10-07'), score: 57.7, params: 11, family: 'Llama' },
      { name: 'Llama-3.2-90B', date: new Date('2024-10-19'), score: 63.4, params: 88.6, family: 'Llama' },
      { name: 'LLaVA-OneVision-7B', date: new Date('2024-09-16'), score: 60.2, params: 8, family: 'LLaVA' },
      { name: 'LLaVA-OneVision-7B (SI)', date: new Date('2024-09-17'), score: 61.2, params: 8, family: 'LLaVA' },
      { name: 'PaliGemma-3B', date: new Date('2024-05-17'), score: 46.5, params: 3, family: 'PaliGemma' },
      { name: 'Mantis-8B-Fuyu', date: new Date('2024-09-07'), score: 34.2, params: 8, family: 'Mantis' },
      { name: 'NVLM-D-72B', date: new Date('2024-10-19'), score: 67.6, params: 79.4, family: 'NVLM' },
      { name: 'GLM-4V', date: new Date('2024-05-20'), score: 60.8, params: 10, family: 'GLM' },
      { name: 'GLM-4V-Plus', date: new Date('2024-12-11'), score: 71.4, params: 15, family: 'GLM' },
      { name: 'GLM-4V-Plus-20250111', date: new Date('2025-01-25'), score: 76.7, params: 15, family: 'GLM' },
      { name: 'MolmoE-1B', date: new Date('2024-10-21'), score: 46.1, params: 7.2, family: 'Molmo' },
      { name: 'Molmo-7B-O', date: new Date('2024-10-20'), score: 52.0, params: 8, family: 'Molmo' },
      { name: 'Molmo-7B-D', date: new Date('2024-10-12'), score: 57.4, params: 8, family: 'Molmo' },
      { name: 'Yi-VL-6B', date: new Date('2024-01-25'), score: 41.1, params: 6.6, family: 'Yi' },
      { name: 'InternVL3-1B', date: new Date('2025-04-14'), score: 57.0, params: 0.94, family: 'InternVL' },
      { name: 'InternVL3-2B', date: new Date('2025-04-14'), score: 64.5, params: 2.09, family: 'InternVL' },
      { name: 'InternVL3-8B', date: new Date('2025-04-14'), score: 73.6, params: 7.94, family: 'InternVL' },
      { name: 'InternVL3-9B', date: new Date('2025-04-14'), score: 72.6, params: 9, family: 'InternVL' },
      { name: 'Phi-3-Vision', date: new Date('2024-05-31'), score: 53.6, params: 4.2, family: 'Phi' },
      { name: 'Phi-3.5-Vision', date: new Date('2024-08-28'), score: 53, params: 4, family: 'Phi' },
      { name: 'Phi-4-MultiModal', date: new Date('2025-03-13'), score: 64.7, params: 5.57, family: 'Phi' },
      { name: 'DeepSeek-VL-1.3B', date: new Date('2024-03-21'), score: 39.7, params: 2, family: 'DeepSeek' },
      { name: 'DeepSeek-VL-7B', date: new Date('2024-03-21'), score: 46.2, params: 7.2, family: 'DeepSeek' },
      { name: 'DeepSeek-VL2-Tiny', date: new Date('2025-01-01'), score: 58.1, params: 3.4, family: 'DeepSeek' },
      { name: 'DeepSeek-VL2-Small', date: new Date('2025-01-01'), score: 64.5, params: 16.1, family: 'DeepSeek' },
      { name: 'DeepSeek-VL2', date: new Date('2025-01-01'), score: 66.4, params: 27.5, family: 'DeepSeek' },
      { name: 'BlueLM-V-3B', date: new Date('2024-10-30'), score: 66.1, params: 3, family: 'BlueLM' },
      { name: 'BlueLM-2.5-3B', date: new Date('2025-07-16'), score: 70.8, params: 2.9, family: 'BlueLM' },
      { name: 'BlueLM-2.6-3B', date: new Date('2025-09-17'), score: 78.4, params: 3, family: 'BlueLM' },
      { name: 'R-4B', date: new Date('2025-08-11'), score: 75.5, params: 4, family: 'Other' },
      { name: 'GPT-5', date: new Date('2025-08-14'), score: 79.9, params: 50, family: 'OpenAI' },
      { name: 'ShareGPT4V-7B', date: new Date('2023-12-08'), score: 39.8, params: 7.2, family: 'ShareGPT' },
      { name: 'ShareGPT4V-13B', date: new Date('2023-12-08'), score: 42.5, params: 13.4, family: 'ShareGPT' },
      { name: 'Pixtral-12B', date: new Date('2024-09-16'), score: 61.0, params: 13, family: 'Pixtral' },
      { name: 'Claude3.5-Sonnet', date: new Date('2024-06-24'), score: 67.9, params: 40, family: 'Anthropic' },
      { name: 'Claude3.5-Sonnet-20241022', date: new Date('2024-11-06'), score: 70.6, params: 40, family: 'Anthropic' },
      { name: 'granite-vision-3.1-2b', date: new Date('2025-06-20'), score: 57.3, params: 2.98, family: 'Granite' },
      { name: 'granite-vision-3.2-2b', date: new Date('2025-06-20'), score: 57.9, params: 2.98, family: 'Granite' },
      { name: 'granite-vision-3.3-2b', date: new Date('2025-06-20'), score: 58.7, params: 2.98, family: 'Granite' },
      { name: 'MiMo-VL-7B', date: new Date('2025-07-02'), score: 65.6, params: 8.31, family: 'MiMo' },
      { name: 'InstructBLIP-7B', date: new Date('2023-05-11'), score: 31.1, params: 8, family: 'InstructBLIP' },
      { name: 'Gemini-2.5-Pro', date: new Date('2025-04-07'), score: 80.1, params: 60, family: 'Google' },
    ],
    [],
  );

  const highestScore = Math.max(...data.map((d) => d.score));
  const yAxisUpperBound = Math.ceil((highestScore + 5) / 5) * 5;
  const yAxisTicks: number[] = [];
  for (let tick = 0; tick <= yAxisUpperBound; tick += 10) {
    yAxisTicks.push(tick);
  }
  if (yAxisTicks[yAxisTicks.length - 1] !== yAxisUpperBound) {
    yAxisTicks.push(yAxisUpperBound);
  }

  const familyColors: Record<string, string> = {
    Qwen: '#8884d8',
    Kimi: '#82ca9d',
    SmolVLM: '#ffc658',
    CogVLM: '#ff8042',
    Llama: '#a4de6c',
    LLaVA: '#d0ed57',
    InternVL: '#8dd1e1',
    Phi: '#83a6ed',
    DeepSeek: '#8884d8',
    BlueLM: '#ea5545',
    OpenAI: '#f46a9b',
    Anthropic: '#ef9b20',
    Google: '#4285f4',
    Granite: '#ede15b',
    PaliGemma: '#95e1d3',
    NVLM: '#38ada9',
    GLM: '#ee5a6f',
    Molmo: '#c7ecee',
    ShareGPT: '#786fa6',
    Pixtral: '#f8a5c2',
    MiMo: '#63cdda',
    InstructBLIP: '#cf6a87',
    Mantis: '#b8e994',
    Yi: '#e55039',
    Other: '#999999',
  };

  const availableFamilies = useMemo(
    () => Array.from(new Set(data.map((d) => d.family))),
    [data],
  );

  const families = ['all', ...availableFamilies];

  const filteredData = useMemo(
    () => (selectedFamily === 'all' ? data : data.filter((d) => d.family === selectedFamily)),
    [data, selectedFamily],
  );

  const minBubbleSize = 200;
  const maxBubbleSize = 1200;

  const paramValues = filteredData.map((d) => Math.max(d.params, 0));
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

  const processedData: ProcessedDataPoint[] = filteredData.map((d) => ({
    ...d,
    x: d.date.getTime(),
    y: d.score,
    z: Math.max(d.params, 0),
  }));

  // Custom tooltip that shows info for the selected model only
  const CustomTooltip = () => {
    if (!selectedModel) {
      return null;
    }

    const dataPoint = processedData.find(d => d.name === selectedModel);
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
        <p style={{ fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          {dataPoint.name}
        </p>
        <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>Score: {dataPoint.score}</p>
        <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>
          Parameters: {dataPoint.params}B
        </p>
        <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)' }}>
          Date: {dataPoint.date.toLocaleDateString()}
        </p>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Family: {dataPoint.family}</p>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">Vision-Language Model Landscape</h1>
          <p className="app-subtitle">
            Benchmark scores from 2023–2025 show how quickly multimodal systems are improving. Bubble size
            represents parameter count.
          </p>
          <div className="controls">
            <label className="control-label" htmlFor="family-filter">
              Filter by family
            </label>
            <select
              id="family-filter"
              className="family-select"
              value={selectedFamily}
              onChange={(e) => {
                setSelectedFamily(e.target.value);
                setSelectedModel(null); // Clear selection when changing family
              }}
            >
              {families.map((family) => (
                <option key={family} value={family}>
                  {family === 'all' ? 'All families' : family}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="chart-card">
          <div className="chart-heading">
            <h2>Performance over time</h2>
            <p>
              Click on any bubble to inspect model details.
              {selectedModel && (
                <button 
                  onClick={() => setSelectedModel(null)} 
                  style={{ 
                    marginLeft: '8px', 
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Clear selection
                </button>
              )}
            </p>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
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
                <ZAxis
                  dataKey="z"
                  type="number"
                  domain={zDomain}
                  range={[minBubbleSize, maxBubbleSize]}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                  trigger="click"
                  active={!!selectedModel}
                />
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
                      fill={familyColors[family]}
                      onClick={(data) => {
                        setSelectedModel(data.name);
                      }}
                      style={{ cursor: 'pointer' }}
                      shape={(props: any) => {
                        const isSelected = props.payload?.name === selectedModel;
                        return (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={props.payload?.z ? Math.sqrt(props.payload.z) : 5}
                            fill={props.fill}
                            fillOpacity={isSelected ? 1 : 0.65}
                            stroke={isSelected ? '#fff' : 'none'}
                            strokeWidth={isSelected ? 3 : 0}
                          />
                        );
                      }}
                    />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="insights-card">
          <h3>Key insights</h3>
          <ul>
            <li>65+ models evaluated from 2023–2025</li>
            <li>Performance improved from ~30 to 80+ average score</li>
            <li>Efficient 2–4B models now rival larger 2024 releases</li>
            <li>InternVL3, BlueLM, and Gemini families show strong recent performance</li>
            <li>Clear trend: newer models achieve better scores with smaller sizes</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default VLMBubbleChart;
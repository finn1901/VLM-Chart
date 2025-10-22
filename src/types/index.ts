export interface BenchmarkScores {
  MMBench_V11: number;
  MMStar: number;
  MMMU_VAL: number;
  MathVista: number;
  OCRBench: number;
  AI2D: number;
  HallusionBench: number;
  MMVet: number;
}

export type BenchmarkName = keyof BenchmarkScores;

export interface BenchmarkWeights {
  MMBench_V11: number;
  MMStar: number;
  MMMU_VAL: number;
  MathVista: number;
  OCRBench: number;
  AI2D: number;
  HallusionBench: number;
  MMVet: number;
}

export interface DataPoint {
  name: string;
  date: string;
  score: number;
  params: number;
  family: string;
  benchmarks: BenchmarkScores;
  paramsEstimated?: boolean; // True if params are estimated, not from official source
}

export interface ProcessedDataPoint {
  name: string;
  date: Date;
  score: number;
  params: number;
  family: string;
  benchmarks: BenchmarkScores;
  paramsEstimated?: boolean; // True if params are estimated, not from official source
  x: number;
  y: number;
  z: number;
}

export interface ScatterShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
  payload?: ProcessedDataPoint;
}

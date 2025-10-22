import { BenchmarkScores, BenchmarkWeights, BenchmarkName } from '../types';

// Default weights (all equal)
export const DEFAULT_WEIGHTS: BenchmarkWeights = {
  MMBench_V11: 1.0,
  MMStar: 1.0,
  MMMU_VAL: 1.0,
  MathVista: 1.0,
  OCRBench: 1.0,
  AI2D: 1.0,
  HallusionBench: 1.0,
  MMVet: 1.0,
};

// Benchmark display names and descriptions
export const BENCHMARK_INFO: Record<BenchmarkName, { name: string; description: string }> = {
  MMBench_V11: {
    name: 'MMBench',
    description: 'General multimodal understanding',
  },
  MMStar: {
    name: 'MMStar',
    description: 'Challenging multimodal reasoning',
  },
  MMMU_VAL: {
    name: 'MMMU',
    description: 'College-level multimodal understanding',
  },
  MathVista: {
    name: 'MathVista',
    description: 'Mathematical reasoning with visuals',
  },
  OCRBench: {
    name: 'OCRBench',
    description: 'Text recognition and understanding',
  },
  AI2D: {
    name: 'AI2D',
    description: 'Diagram understanding',
  },
  HallusionBench: {
    name: 'HallusionBench',
    description: 'Hallucination resistance',
  },
  MMVet: {
    name: 'MMVet',
    description: 'Multimodal veterinary understanding',
  },
};

// Preset weight profiles
export interface WeightPreset {
  name: string;
  description: string;
  weights: BenchmarkWeights;
}

export const WEIGHT_PRESETS: WeightPreset[] = [
  {
    name: 'Balanced',
    description: 'Equal weight for all benchmarks',
    weights: DEFAULT_WEIGHTS,
  },
  {
    name: 'OCR-Focused',
    description: 'Prioritize text recognition tasks',
    weights: {
      ...DEFAULT_WEIGHTS,
      OCRBench: 3.0,
      AI2D: 1.5,
    },
  },
  {
    name: 'Math-Focused',
    description: 'Prioritize mathematical reasoning',
    weights: {
      ...DEFAULT_WEIGHTS,
      MathVista: 3.0,
      MMMU_VAL: 1.5,
    },
  },
  {
    name: 'Reasoning-Heavy',
    description: 'Emphasize complex reasoning tasks',
    weights: {
      ...DEFAULT_WEIGHTS,
      MMStar: 2.0,
      MMMU_VAL: 2.0,
      MathVista: 2.0,
      HallusionBench: 0.5,
    },
  },
  {
    name: 'Reliability-Focused',
    description: 'Prioritize hallucination resistance',
    weights: {
      ...DEFAULT_WEIGHTS,
      HallusionBench: 3.0,
      MMVet: 1.5,
    },
  },
  {
    name: 'General Chat',
    description: 'Best for general-purpose chat applications',
    weights: {
      ...DEFAULT_WEIGHTS,
      MMBench_V11: 2.0,
      MMVet: 2.0,
      HallusionBench: 1.5,
    },
  },
];

/**
 * Calculate weighted average score from benchmark scores and weights
 */
export function calculateWeightedScore(
  benchmarks: BenchmarkScores,
  weights: BenchmarkWeights = DEFAULT_WEIGHTS,
): number {
  const benchmarkNames = Object.keys(benchmarks) as BenchmarkName[];

  let totalWeightedScore = 0;
  let totalWeight = 0;

  benchmarkNames.forEach((benchmark) => {
    const score = benchmarks[benchmark];
    const weight = weights[benchmark];

    totalWeightedScore += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 10) / 10 : 0;
}

/**
 * Normalize weights to sum to 1 (for display purposes)
 */
export function normalizeWeights(weights: BenchmarkWeights): BenchmarkWeights {
  const benchmarkNames = Object.keys(weights) as BenchmarkName[];
  const totalWeight = benchmarkNames.reduce((sum, name) => sum + weights[name], 0);

  if (totalWeight === 0) return DEFAULT_WEIGHTS;

  const normalized = {} as BenchmarkWeights;
  benchmarkNames.forEach((name) => {
    normalized[name] = weights[name] / totalWeight;
  });

  return normalized;
}

/**
 * Get relative importance percentage for display
 */
export function getWeightPercentage(weights: BenchmarkWeights, benchmark: BenchmarkName): number {
  const normalized = normalizeWeights(weights);
  return Math.round(normalized[benchmark] * 100);
}

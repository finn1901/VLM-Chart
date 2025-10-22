import { useEffect, useState } from 'react';
import modelsData from '../data/models.json';
import type { DataPoint, BenchmarkScores } from '../types';

interface TransformedDataPoint {
  name: string;
  date: Date;
  score: number;
  params: number;
  family: string;
  benchmarks: BenchmarkScores;
  paramsEstimated?: boolean; // True if params are estimated, not from official source
}

interface UseModelDataReturn {
  data: TransformedDataPoint[];
  isLoading: boolean;
  error: string | null;
}

export const useModelData = (): UseModelDataReturn => {
  const [data, setData] = useState<TransformedDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      // Transform the JSON data (with string dates) to our runtime format (with Date objects)
      const transformedData = modelsData.map((item: DataPoint) => ({
        name: item.name,
        date: new Date(item.date),
        score: item.score,
        params: item.params,
        family: item.family,
        benchmarks: item.benchmarks,
        paramsEstimated: item.paramsEstimated,
      }));
      setData(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to load model data. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
};

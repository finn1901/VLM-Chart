import { useEffect, useState } from 'react';
import modelsData from '../data/models.json';
import type { DataPoint } from '../types';

interface UseModelDataReturn {
  data: Array<{ name: string; date: Date; score: number; params: number; family: string }>;
  isLoading: boolean;
  error: string | null;
}

export const useModelData = (): UseModelDataReturn => {
  const [data, setData] = useState<Array<{ name: string; date: Date; score: number; params: number; family: string }>>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      // Transform the JSON data (with string dates) to our runtime format (with Date objects)
      const transformedData = modelsData.map((item: DataPoint) => ({
        ...item,
        date: new Date(item.date),
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

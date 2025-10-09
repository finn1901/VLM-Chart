import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useModelData } from './useModelData';

describe('useModelData', () => {
  it('should load data successfully', async () => {
    const { result } = renderHook(() => useModelData());

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('should load and transform model data', async () => {
    const { result } = renderHook(() => useModelData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data.length).toBeGreaterThan(0);

    // Check that dates are transformed to Date objects
    const firstModel = result.current.data[0];
    expect(firstModel).toHaveProperty('name');
    expect(firstModel).toHaveProperty('date');
    expect(firstModel).toHaveProperty('score');
    expect(firstModel).toHaveProperty('params');
    expect(firstModel).toHaveProperty('family');
    expect(firstModel.date).toBeInstanceOf(Date);
  });

  it('should have valid model data structure', async () => {
    const { result } = renderHook(() => useModelData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.data.forEach((model) => {
      expect(typeof model.name).toBe('string');
      expect(model.date).toBeInstanceOf(Date);
      expect(typeof model.score).toBe('number');
      expect(typeof model.params).toBe('number');
      expect(typeof model.family).toBe('string');

      // Validate score range
      expect(model.score).toBeGreaterThanOrEqual(0);
      expect(model.score).toBeLessThanOrEqual(100);

      // Validate params is non-negative
      expect(model.params).toBeGreaterThanOrEqual(0);
    });
  });

  it('should contain expected model families', async () => {
    const { result } = renderHook(() => useModelData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const families = new Set(result.current.data.map((m) => m.family));

    // Check for some known families
    expect(families.size).toBeGreaterThan(0);
    expect(result.current.data.some((m) => m.family === 'Qwen' || m.family === 'OpenAI' || m.family === 'Google')).toBe(
      true,
    );
  });
});

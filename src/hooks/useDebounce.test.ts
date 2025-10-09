import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'changed', delay: 500 });

    // Value should still be the initial value
    expect(result.current).toBe('initial');

    // Fast-forward time
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBe('first');

    // Change value multiple times rapidly
    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'third' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'fourth' });

    // At this point, only 400ms have passed total
    expect(result.current).toBe('first');

    // Advance full 500ms from last change
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('fourth');
  });

  it('should work with different delays', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test', delay: 300 },
    });

    rerender({ value: 'new', delay: 300 });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('new');
  });

  it('should handle number values', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBe(0);

    rerender({ value: 42 });

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(42);
  });

  it('should handle object values', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: { name: 'John' } },
    });

    expect(result.current).toEqual({ name: 'John' });

    const newValue = { name: 'Jane' };
    rerender({ value: newValue });

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual(newValue);
  });
});

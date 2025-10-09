import { useEffect, useRef } from 'react';

interface UseKeyboardShortcutsProps {
  onEscape: () => void;
  onSlash: () => void;
}

export const useKeyboardShortcuts = ({ onEscape, onSlash }: UseKeyboardShortcutsProps) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key - clear selection/search
      if (event.key === 'Escape') {
        onEscape();
        // Also blur the search input if it's focused
        if (document.activeElement instanceof HTMLInputElement) {
          document.activeElement.blur();
        }
      }

      // "/" key - focus search input (only if not already in an input)
      if (
        event.key === '/' &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        onSlash();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onSlash]);

  return { searchInputRef };
};

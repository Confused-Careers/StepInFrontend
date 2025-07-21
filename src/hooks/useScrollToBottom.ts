import { useEffect, useRef } from 'react';

/**
 * Custom hook to auto-scroll to the bottom of a container when items change.
 * Returns a ref to place on the scrollable container.
 */
export default function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(deps: any[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

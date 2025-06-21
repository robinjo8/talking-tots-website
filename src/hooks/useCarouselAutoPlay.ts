
import { useState, useEffect, useCallback } from "react";

interface UseCarouselAutoPlayProps {
  api: any;
  current: number;
  count: number;
}

export const useCarouselAutoPlay = ({ api, current, count }: UseCarouselAutoPlayProps) => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  // Function to handle automatic scrolling
  const autoScroll = useCallback(() => {
    if (!api || !autoPlay) return;

    // Handle direction changes
    if (direction === 'right') {
      // If we're at the last item, change direction
      if (current === count - 1) {
        setDirection('left');
        api.scrollPrev();
      } else {
        api.scrollNext();
      }
    } else {
      // If we're at the first item, change direction
      if (current === 0) {
        setDirection('right');
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    }
  }, [api, autoPlay, current, count, direction]);

  // Setup auto-scrolling with interval
  useEffect(() => {
    const interval = setInterval(autoScroll, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [autoScroll]);

  // Pause auto-scroll when user interacts with carousel
  const handleManualNavigation = () => {
    setAutoPlay(false);

    // Resume auto-scroll after a period of inactivity
    const timeout = setTimeout(() => {
      setAutoPlay(true);
    }, 10000); // Resume after 10 seconds of inactivity

    return () => clearTimeout(timeout);
  };

  return { handleManualNavigation };
};

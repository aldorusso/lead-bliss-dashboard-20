import { useCallback, useRef, useState } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  horizontal: 'left' | 'right' | null;
  vertical: 'up' | 'down' | null;
}

interface UseTouchGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressThreshold?: number;
}

export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  swipeThreshold = 50,
  longPressThreshold = 500,
}: UseTouchGesturesOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPressed(true);
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    touchEnd.current = null;

    // Long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, longPressThreshold);
    }
  }, [onLongPress, longPressThreshold]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart.current || !touchEnd.current) {
      // Simple tap
      if (onTap && !touchEnd.current) {
        onTap();
      }
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction
    if (Math.max(absDeltaX, absDeltaY) > swipeThreshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (onTap) {
      // Small movement, consider it a tap
      onTap();
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, swipeThreshold]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isPressed,
  };
}
"use client";

import React, { useRef, useState, useCallback, ReactNode } from "react";
import { useHorizontalSwipeNavigation } from "@/hooks/use-swipe";
import { css } from "@/styled-system/css";

export interface SwipeableLayoutProps {
  /** Current page identifier */
  currentPage: string;
  /** Callback when page should change */
  onPageChange: (page: string) => void;
  /** Available pages as an array of page identifiers */
  pages: string[];
  /** Children components mapped by page identifier */
  children: Record<string, ReactNode>;
  /** Whether transitions are currently disabled */
  isTransitioning?: boolean;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** CSS transition timing function */
  transitionTimingFunction?: string;
  /** Minimum swipe distance to trigger page change */
  minSwipeDistance?: number;
  /** Minimum swipe velocity to trigger page change */
  minSwipeVelocity?: number;
}

/**
 * SwipeableLayout component for handling horizontal page transitions with swipe gestures
 * 
 * Features:
 * - Horizontal swipe navigation between pages
 * - Touch and mouse gesture support
 * - Smooth CSS transitions with configurable timing
 * - Prevents transitions during ongoing transitions
 * - Type-safe page management
 */
export const SwipeableLayout: React.FC<SwipeableLayoutProps> = ({
  currentPage,
  onPageChange,
  pages,
  children,
  isTransitioning = false,
  transitionDuration = 700,
  transitionTimingFunction = "ease-in-out",
  minSwipeDistance = 100,
  minSwipeVelocity = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalTransitioning, setInternalTransitioning] = useState(false);

  // Get current page index for positioning calculations
  const currentPageIndex = pages.indexOf(currentPage);
  
  // Handle page transition with timing control
  const handlePageTransition = useCallback((targetPage: string) => {
    if (targetPage === currentPage || isTransitioning || internalTransitioning) {
      return;
    }

    setInternalTransitioning(true);
    onPageChange(targetPage);

    // Allow CSS transition to complete
    setTimeout(() => {
      setInternalTransitioning(false);
    }, transitionDuration);
  }, [currentPage, isTransitioning, internalTransitioning, onPageChange, transitionDuration]);

  // Swipe navigation handlers
  const handleSwipeLeft = useCallback(() => {
    const nextIndex = currentPageIndex + 1;
    if (nextIndex < pages.length) {
      handlePageTransition(pages[nextIndex]);
    }
  }, [currentPageIndex, pages, handlePageTransition]);

  const handleSwipeRight = useCallback(() => {
    const prevIndex = currentPageIndex - 1;
    if (prevIndex >= 0) {
      handlePageTransition(pages[prevIndex]);
    }
  }, [currentPageIndex, pages, handlePageTransition]);

  // Setup gesture navigation
  const { gestureHandlers } = useHorizontalSwipeNavigation(
    handleSwipeLeft,
    handleSwipeRight,
    {
      enabled: !isTransitioning && !internalTransitioning,
      swipeConfig: {
        minSwipeDistance,
        minSwipeVelocity,
      },
    }
  );

  // CSS transition properties
  const transitionStyle = `transform ${transitionDuration}ms ${transitionTimingFunction}`;

  return (
    <div
      ref={containerRef}
      className={css({
        flex: "1",
        position: "relative",
        overflow: "hidden",
      })}
      onTouchStart={(e) => gestureHandlers.onTouchStart(e.nativeEvent)}
      onTouchMove={(e) => gestureHandlers.onTouchMove(e.nativeEvent)}
      onTouchEnd={(e) => gestureHandlers.onTouchEnd(e.nativeEvent)}
      onTouchCancel={(e) => gestureHandlers.onTouchCancel(e.nativeEvent)}
      onMouseDown={(e) => gestureHandlers.onMouseDown(e.nativeEvent)}
      onMouseMove={(e) => gestureHandlers.onMouseMove(e.nativeEvent)}
      onMouseUp={(e) => gestureHandlers.onMouseUp(e.nativeEvent)}
      onMouseLeave={(e) => gestureHandlers.onMouseLeave(e.nativeEvent)}
    >
      <div
        className={css({
          position: "relative",
          width: "full",
          height: "full",
        })}
      >
        {pages.map((pageId, index) => {
          // Calculate transform based on page position relative to current page
          const offset = index - currentPageIndex;
          const translateX = `${offset * 100}%`;

          return (
            <div
              key={pageId}
              className={css({
                position: "absolute",
                inset: "0",
                transition: transitionStyle,
                transform: `translateX(${translateX})`,
              })}
            >
              {children[pageId]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export type for external use (already exported with interface)
// export type { SwipeableLayoutProps };
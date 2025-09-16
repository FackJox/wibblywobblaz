"use client";

import React, { useState, useEffect, useRef } from "react";
import { SwipeableLayout } from "@/components/layouts/swipeable-layout";
import { AnimationPerformanceOverlay } from "@/components/dev/animation-performance-overlay";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { LinksPage } from "@/components/pages/links-page";
import { PartiesPage } from "@/components/pages/parties-page";
import { ShhhAnimation } from "@/components/wibbly/shhh-animation";
import { useSharedMouse } from "@/hooks/use-shared-mouse";
import { css } from "@/styled-system/css";
import { upcomingParties, socialLinks } from "@/data/constants";


export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shhhState, setShhhState] = useState<
    "hidden" | "animating" | "visible"
  >("hidden");
  const freeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Single shared mouse position for entire app
  const mousePosition = useSharedMouse({ throttleMs: 16 });
  
  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  

  const handlePageTransition = (targetPage: "links" | "parties") => {
    if (targetPage === currentPage || isTransitioning) return;

    setIsTransitioning(true);
    setMobileMenuOpen(false);
    setCurrentPage(targetPage);

    // Allow CSS transition to complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Match SwipeableLayout default duration
  };

  // Handle FREE button click with accessibility
  const handleFreeClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setShhhState("animating");
    // Store reference to the button that triggered the animation for focus management
    if (freeButtonRef.current) {
      freeButtonRef.current.blur(); // Remove focus during animation
    }
  };

  // Handle Shhh animation completion
  const handleShhhAnimationEnd = () => {
    setShhhState("visible");
  };

  // Handle Instagram opening
  const handleInstagramOpen = () => {
    window.open("https://instagram.com/wibblywobblaz", "_blank");
    // Hide the shhh SVG after 2 seconds
    setTimeout(() => {
      setShhhState("hidden");
    }, 2000);
  };

  // Handle keyboard events for FREE button
  const handleFreeKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFreeClick(e);
    }
  };

  // Reset shhh state when back on links page and transition is complete
  useEffect(() => {
    if (currentPage === "links" && !isTransitioning && shhhState !== "hidden") {
      // Reset the shhh state so animation can run again next time
      const resetTimer = setTimeout(() => {
        setShhhState("hidden");
      }, 100); // Small delay to ensure transition is fully complete

      return () => clearTimeout(resetTimer);
    }
  }, [currentPage, isTransitioning, shhhState]);


  return (
    <div className={css({
      position: 'fixed',
      inset: '0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    })}>
      {/* Shared Navigation */}
      <NavigationHeader
        currentPage={currentPage}
        mobileMenuOpen={mobileMenuOpen}
        isTransitioning={isTransitioning}
        mousePosition={mousePosition}
        onPageTransition={handlePageTransition}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      {/* SwipeableLayout for page transitions */}
      <SwipeableLayout
        currentPage={currentPage}
        onPageChange={(page) => handlePageTransition(page as "links" | "parties")}
        pages={["links", "parties"]}
        isTransitioning={isTransitioning}
        transitionDuration={700}
        minSwipeDistance={100}
        minSwipeVelocity={0.5}
      >
        {{
          links: (
            <LinksPage
              socialLinks={socialLinks}
              isVisible={currentPage === "links"}
              mousePosition={mousePosition}
            />
          ),
          parties: (
            <div className={css({ height: 'full' })}>
              {/* Shhh Animation Component */}
              <ShhhAnimation
                state={shhhState}
                onAnimationEnd={handleShhhAnimationEnd}
                onInstagramOpen={handleInstagramOpen}
              />

              <PartiesPage
                upcomingParties={upcomingParties}
                isVisible={currentPage === "parties"}
                mousePosition={mousePosition}
                handleFreeClick={handleFreeClick}
                handleFreeKeyDown={handleFreeKeyDown}
                shhhState={shhhState}
                freeButtonRef={freeButtonRef}
              />
            </div>
          ),
        }}
      </SwipeableLayout>

      {/* Performance Overlay (Development Only) */}
      <AnimationPerformanceOverlay />
    </div>
  );
}

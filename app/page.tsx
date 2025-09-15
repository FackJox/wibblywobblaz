"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import { SwipeableLayout } from "@/components/layouts/swipeable-layout";
import { AnimationPerformanceOverlay } from "@/components/dev/animation-performance-overlay";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { PartyCard } from "@/components/wibbly/party-card";
import { LinksPage } from "@/components/pages/links-page";
import { ShhhAnimation } from "@/components/wibbly/shhh-animation";
import { css } from "@/styled-system/css";
import { PartyEvent } from "@/types";
import { upcomingParties, socialLinks } from "@/data/constants";

// Define page components outside to prevent recreation

const PartiesPage = ({
  upcomingParties,
  isVisible,
  handleFreeClick,
  handleFreeKeyDown,
  shhhState,
  freeButtonRef,
}: {
  upcomingParties: Array<PartyEvent>;
  isVisible: boolean;
  handleFreeClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  handleFreeKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  shhhState: "hidden" | "animating" | "visible";
  freeButtonRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  // Scroll animations for parties page
  const partiesStagger = useStaggerReveal<HTMLDivElement>(upcomingParties.length, {
    staggerDelay: 200,
    duration: 700,
    threshold: 0.1,
    once: false,
  });
  
  // Note: Individual magnetic and parallax effects are now handled within PartyCard component

  // Store animation functions in refs to avoid dependency issues
  const partiesTriggerRef = React.useRef(partiesStagger.trigger);
  const partiesResetRef = React.useRef(partiesStagger.reset);
  
  React.useEffect(() => {
    partiesTriggerRef.current = partiesStagger.trigger;
    partiesResetRef.current = partiesStagger.reset;
  }, [partiesStagger.trigger, partiesStagger.reset]);

  // Reset animations when page becomes hidden
  React.useEffect(() => {
    console.log('[RND-PAGE] PartiesPage visibility changed:', isVisible);
    if (!isVisible) {
      // Reset animations when page is hidden
      partiesResetRef.current();
    } else {
      // Trigger animations when page becomes visible
      setTimeout(() => {
        partiesTriggerRef.current();
      }, 100);
    }
  }, [isVisible]);

  return (
    <div className={css({
      height: 'full',
      backgroundColor: 'black',
      color: 'white',
      overflowY: 'auto'
    })}>
      <div className={css({
        padding: { base: '4', md: '8' }
      })}>
        <div
          ref={partiesStagger.containerRef}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { base: '4', md: '6' },
            maxWidth: '7xl',
            marginX: 'auto'
          })}
        >
          {upcomingParties.map((party: PartyEvent, index: number) => (
            <PartyCard
              key={party.id}
              party={party}
              index={index}
              onFreeClick={handleFreeClick}
              onFreeKeyDown={handleFreeKeyDown}
              shhhState={shhhState}
              freeButtonRef={index === 0 ? freeButtonRef : undefined}
              staggerAnimation={{
                opacity: partiesStagger.items[index]?.opacity,
                transform: partiesStagger.items[index]?.transform,
                transition: partiesStagger.items[index]?.transition,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shhhState, setShhhState] = useState<
    "hidden" | "animating" | "visible"
  >("hidden");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const freeButtonRef = useRef<HTMLButtonElement>(null);
  
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
            />
          ),
          parties: (
            <div ref={scrollContainerRef} className={css({ height: 'full' })}>
              {/* Shhh Animation Component */}
              <ShhhAnimation
                state={shhhState}
                onAnimationEnd={handleShhhAnimationEnd}
                onInstagramOpen={handleInstagramOpen}
              />

              <PartiesPage
                upcomingParties={upcomingParties}
                isVisible={currentPage === "parties"}
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

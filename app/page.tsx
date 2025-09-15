"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import {
  useSimpleFadeIn,
} from "@/hooks/use-scroll-animations";
import { useMouseParallax } from "@/hooks/use-parallax";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";
import { useHorizontalSwipeNavigation } from "@/hooks/use-swipe";
import { GestureWrapper } from "@/components/ui/gesture-wrapper";
import { toast } from "@/components/ui/use-toast";
import { AnimationPerformanceOverlay } from "@/components/dev/animation-performance-overlay";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { PartyCard } from "@/components/wibbly/party-card";
import { SocialLinkButton } from "@/components/wibbly/social-link-button";
import { css, cx } from "@/styled-system/css";
import { PartyEvent, SocialLink } from "@/types";
import { upcomingParties, socialLinks } from "@/data/constants";

// Define page components outside to prevent recreation
const LinksPage = ({
  socialLinks,
  isVisible,
}: {
  socialLinks: Array<SocialLink>;
  isVisible: boolean;
}) => {
  // Unified stagger animation for all elements (3 headers + 4 buttons = 7 total)
  const logoFadeIn = useSimpleFadeIn("left");
  const allButtonsStagger = useStaggerReveal<HTMLDivElement>(7, {
    staggerDelay: 150,
    duration: 600,
    threshold: 0.1,
    once: false,
  });
  
  // Mouse parallax for depth layers
  const logoParallax = useMouseParallax<HTMLDivElement>(0.05, { maxOffset: 30 }); // Furthest layer - moves most
  const linksParallax = useMouseParallax<HTMLDivElement>(0.02, { maxOffset: 15 }); // Middle layer - moderate movement
  
  // Magnetic effects for link buttons - create individual hooks
  const ticketLinkMagnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });
  const merchLinkMagnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });

  // Store animation functions in refs to avoid dependency issues
  const staggerTriggerRef = React.useRef(allButtonsStagger.trigger);
  const staggerResetRef = React.useRef(allButtonsStagger.reset);
  const fadeTriggerRef = React.useRef(logoFadeIn.trigger);
  const fadeResetRef = React.useRef(logoFadeIn.reset);
  
  React.useEffect(() => {
    staggerTriggerRef.current = allButtonsStagger.trigger;
    staggerResetRef.current = allButtonsStagger.reset;
  }, [allButtonsStagger.trigger, allButtonsStagger.reset]);
  
  React.useEffect(() => {
    fadeTriggerRef.current = logoFadeIn.trigger;
    fadeResetRef.current = logoFadeIn.reset;
  }, [logoFadeIn.trigger, logoFadeIn.reset]);

  // Reset animations when page becomes hidden
  React.useEffect(() => {
    console.log('[RND-PAGE] LinksPage visibility changed:', isVisible);
    if (!isVisible) {
      // Reset animations when page is hidden
      staggerResetRef.current();
      fadeResetRef.current();
    } else {
      // Trigger animations when page becomes visible
      setTimeout(() => {
        staggerTriggerRef.current();
        fadeTriggerRef.current();
      }, 100);
    }
  }, [isVisible]);

  return (
    <div className={css({
      height: 'full',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: { base: 'column', md: 'row' },
      position: 'relative'
    })}>
      {/* Left Side - Logo */}
      <div className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { base: '4', md: '8' },
        backgroundColor: 'white',
        flex: { md: '1' },
        height: { md: 'full' },
        zIndex: 1
      })}>
        <div
          ref={(el) => {
            logoFadeIn.ref.current = el;
            logoParallax.ref.current = el;
          }}
          className={css({
            maxWidth: 'lg',
            width: 'full'
          })}
          style={{
            ...logoFadeIn.styles,
            ...logoParallax.styles,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          <Image
            src="/images/wibbly-wobblaz-logo.png"
            alt="WIBBLY WOBBLAZ"
            width={500}
            height={400}
            className={css({
              width: 'full',
              height: 'auto'
            })}
            priority
          />
        </div>
      </div>

      {/* Right Side - Links */}
      <div className={css({
        flex: '1',
        backgroundColor: 'black',
        color: 'white',
        padding: { base: '4', md: '8' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: { md: 'full' },
        zIndex: 2
      })}>
        <div 
          ref={linksParallax.ref}
          className={css({
            '& > * + *': {
              marginTop: { base: '6', md: '8' }
            }
          })}
          style={{
            ...linksParallax.styles,
            transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {/* Social Links */}
          <div className={css({
            '& > * + *': {
              marginTop: '4'
            }
          })} ref={allButtonsStagger.containerRef}>
            <h2 
              className={css({
                fontSize: { base: '2xl', md: '3xl' },
                fontWeight: 'black',
                letterSpacing: 'tighter',
                borderBottom: '2px solid white',
                paddingBottom: '2'
              })}
              style={{
                opacity: allButtonsStagger.items[0]?.opacity ?? 0,
                transform:
                  allButtonsStagger.items[0]?.transform ??
                  "translateY(20px) scale(0.95)",
                transition:
                  allButtonsStagger.items[0]?.transition ?? "none",
              }}
            >
              FOLLOW US
            </h2>
            <div className={css({
              '& > * + *': {
                marginTop: '3'
              }
            })}>
              {socialLinks.map((social, index) => (
                <SocialLinkButton
                  key={social.name}
                  social={social}
                  style={{
                    opacity: allButtonsStagger.items[index + 1]?.opacity ?? 0,
                    transform:
                      allButtonsStagger.items[index + 1]?.transform ??
                      "translateY(20px) scale(0.95)",
                    transition:
                      allButtonsStagger.items[index + 1]?.transition ?? "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tickets */}
          <div className={css({
            '& > * + *': {
              marginTop: '4'
            }
          })}>
            <h2 
              className={css({
                fontSize: { base: '2xl', md: '3xl' },
                fontWeight: 'black',
                letterSpacing: 'tighter',
                borderBottom: '2px solid white',
                paddingBottom: '2'
              })}
              style={{
                opacity: allButtonsStagger.items[3]?.opacity ?? 0,
                transform:
                  allButtonsStagger.items[3]?.transform ??
                  "translateY(20px) scale(0.95)",
                transition:
                  allButtonsStagger.items[3]?.transition ?? "none",
              }}
            >
              GET TICKETS
            </h2>
            <GestureWrapper
              longPress={{
                enabled: true,
                handlers: {
                  onLongPress: () => {
                    navigator.clipboard.writeText("https://hdfst.uk/e132325");
                    toast({
                      title: "Ticket Link Copied!",
                      description: "Headfirst ticket link copied to clipboard",
                      duration: 2000,
                    });
                  },
                },
                options: {
                  duration: 800,
                },
              }}
              feedback={{
                enabled: true,
                variant: "pulse",
                showProgress: true,
                color: "primary",
              }}
              style={{
                opacity: allButtonsStagger.items[4]?.opacity ?? 0,
                transform:
                  allButtonsStagger.items[4]?.transform ??
                  "translateY(20px) scale(0.95)",
                transition:
                  allButtonsStagger.items[4]?.transition ?? "none",
              }}
            >
              <Button
                ref={ticketLinkMagnetic.ref}
                className={css({
                  width: 'full',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '3',
                  fontSize: { base: 'lg', md: 'xl' },
                  fontWeight: 'bold',
                  padding: '3',
                  border: '2px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  transition: 'all 0.2s',
                  _hover: {
                    backgroundColor: 'white',
                    color: 'black'
                  }
                })}
                onClick={() => window.open('https://hdfst.uk/e132325', '_blank')}
                ripple={true}
                magnetic={true}
                clickAnimation={true}
              >
                <Calendar size={24} />
                <span>HEADFIRST</span>
                <ExternalLink size={20} className="ml-auto" />
              </Button>
            </GestureWrapper>
          </div>

          {/* Merch */}
          <div className={css({
            '& > * + *': {
              marginTop: '4'
            },
            paddingBottom: '10'
          })}>
            <h2 
              className={css({
                fontSize: { base: '2xl', md: '3xl' },
                fontWeight: 'black',
                letterSpacing: 'tighter',
                borderBottom: '2px solid white',
                paddingBottom: '2'
              })}
              style={{
                opacity: allButtonsStagger.items[5]?.opacity ?? 0,
                transform:
                  allButtonsStagger.items[5]?.transform ??
                  "translateY(20px) scale(0.95)",
                transition:
                  allButtonsStagger.items[5]?.transition ?? "none",
              }}
            >
              MERCH STORE
            </h2>
            <GestureWrapper
              longPress={{
                enabled: true,
                handlers: {
                  onLongPress: () => {
                    navigator.clipboard.writeText(
                      "https://merch.wibblywobblaz.xyz",
                    );
                    toast({
                      title: "Merch Link Copied!",
                      description: "Merch store link copied to clipboard",
                      duration: 2000,
                    });
                  },
                },
                options: {
                  duration: 700,
                },
              }}
              feedback={{
                enabled: true,
                variant: "gradient",
                showProgress: true,
                color: "accent",
              }}
              style={{
                opacity: allButtonsStagger.items[6]?.opacity ?? 0,
                transform:
                  allButtonsStagger.items[6]?.transform ??
                  "translateY(20px) scale(0.95)",
                transition:
                  allButtonsStagger.items[6]?.transition ?? "none",
              }}
            >
              <Button
                ref={merchLinkMagnetic.ref}
                className={css({
                  width: 'full',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '3',
                  fontSize: { base: 'lg', md: 'xl' },
                  fontWeight: 'bold',
                  padding: '3',
                  border: '2px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  transition: 'all 0.2s',
                  _hover: {
                    backgroundColor: 'white',
                    color: 'black'
                  }
                })}
                onClick={() => window.open('https://merch.wibblywobblaz.xyz', '_blank')}
                ripple={true}
                magnetic={true}
                clickAnimation={true}
              >
                <ShoppingBag size={20} />
                <span>SHOP NOW</span>
                <ExternalLink size={20} className="ml-auto" />
              </Button>
            </GestureWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const containerRef = useRef<HTMLDivElement>(null);
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
    }, 800);
  };

  // Swipe navigation handlers
  const handleSwipeLeft = () => {
    if (currentPage === "links") {
      handlePageTransition("parties");
    }
  };

  const handleSwipeRight = () => {
    if (currentPage === "parties") {
      handlePageTransition("links");
    }
  };

  // Setup gesture navigation
  const { gestureHandlers } = useHorizontalSwipeNavigation(
    handleSwipeLeft,
    handleSwipeRight,
    {
      enabled: !isTransitioning,
      swipeConfig: {
        minSwipeDistance: 100,
        minSwipeVelocity: 0.5,
      },
    },
  );

  // Handle FREE button click with accessibility
  const handleFreeClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setShhhState("animating");
    // Store reference to the button that triggered the animation for focus management
    if (freeButtonRef.current) {
      freeButtonRef.current.blur(); // Remove focus during animation
    }
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

      {/* Content Container with Conditional Rendering */}
      <div
        ref={containerRef}
        className={css({
          flex: '1',
          position: 'relative',
          overflow: 'hidden'
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
        <div className={css({
          position: 'relative',
          width: 'full',
          height: 'full'
        })}>
          {/* Links Page */}
          <div
            className={css({
              position: 'absolute',
              inset: '0',
              transition: 'transform 0.7s ease-in-out',
              transform: currentPage === "links" ? 'translateX(0)' : 'translateX(-100%)'
            })}
          >
            <LinksPage
              socialLinks={socialLinks}
              isVisible={currentPage === "links"}
            />
          </div>

          {/* Parties Page */}
          <div
            ref={scrollContainerRef}
            className={css({
              position: 'absolute',
              inset: '0',
              transition: 'transform 0.7s ease-in-out',
              transform: currentPage === "parties" ? 'translateX(0)' : 'translateX(100%)'
            })}
          >
            {/* Accessibility live region for animation announcements */}
            <div aria-live="polite" aria-atomic="true" className={css({ srOnly: true })}>
              {shhhState === "animating" &&
                "Animation started, opening Instagram..."}
              {shhhState === "visible" &&
                "Animation completed, Instagram opening in new tab"}
            </div>

            {/* Shhh SVG - stays visible after first animation */}
            <div
              role="img"
              aria-label="Shhh character animation"
              aria-hidden={shhhState === "hidden"}
              className={cx(
                css({
                  position: 'absolute',
                  inset: '0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  willChange: 'transform',
                  zIndex: '50',
                  pointerEvents: 'none'
                }),
                shhhState === "animating" ? css({ 
                  animation: 'slideUpBounce 900ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'fadeInReduced 400ms ease-out forwards'
                  }
                }) : ""
              )}
              style={{
                transform:
                  shhhState === "animating" || shhhState === "visible"
                    ? "translateY(0)"
                    : "translateY(100vh)",
                transition: shhhState === "animating" ? "none" : "transform 600ms ease-in-out",
                opacity:
                  shhhState === "animating" || shhhState === "visible" ? 1 : 0,
              }}
              onAnimationEnd={(e) => {
                if (e.animationName === "slideUpBounce") {
                  setShhhState("visible");
                  window.open("https://instagram.com/wibblywobblaz", "_blank");
                  // Hide the shhh SVG after 2 seconds
                  setTimeout(() => {
                    setShhhState("hidden");
                  }, 2000);
                }
              }}
            >
              <div className={css({ 
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%) translateZ(0)',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              })}>
                <Image
                  src="/images/shhh.svg"
                  alt="Shhh"
                  width={1024}
                  height={1024}
                  className={css({ 
                    width: 'auto', 
                    height: 'auto', 
                    objectFit: 'contain' 
                  })}
                  priority
                />
              </div>
            </div>

            <PartiesPage
              upcomingParties={upcomingParties}
              isVisible={currentPage === "parties"}
              handleFreeClick={handleFreeClick}
              handleFreeKeyDown={handleFreeKeyDown}
              shhhState={shhhState}
              freeButtonRef={freeButtonRef}
            />
          </div>
        </div>
      </div>

      {/* Performance Overlay (Development Only) */}
      <AnimationPerformanceOverlay />
    </div>
  );
}

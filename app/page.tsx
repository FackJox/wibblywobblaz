"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Music,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import {
  useSimpleFadeIn,
} from "@/hooks/use-scroll-animations";
import { useMouseParallax } from "@/hooks/use-parallax";
import { useSimpleMagneticHover, useMagneticHover } from "@/hooks/use-magnetic-hover";
import { useHorizontalSwipeNavigation } from "@/hooks/use-swipe";
import { GestureWrapper } from "@/components/ui/gesture-wrapper";
import { toast } from "@/components/ui/use-toast";
import { AnimationPerformanceOverlay } from "@/components/dev/animation-performance-overlay";
import Link from "next/link";
import { PandaTestComponent } from "@/components/test-panda";
import { css, cx } from "@/styled-system/css";

interface PartyEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  poster: string;
  hotOnes?: boolean;
  ticketLink?: string;
}

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size: number }>;
  url: string;
}

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
  const socialLink1Magnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });
  const socialLink2Magnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });
  const ticketLinkMagnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });
  const merchLinkMagnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.2, maxDistance: 80 });
  
  // Create array of magnetic hooks for easier access
  const socialLinksMagnetic = [socialLink1Magnetic, socialLink2Magnetic];

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
                <GestureWrapper
                  key={social.name}
                  longPress={{
                    enabled: true,
                    handlers: {
                      onLongPress: () => {
                        navigator.clipboard.writeText(social.url);
                        toast({
                          title: "Link Copied!",
                          description: `${social.name} link copied to clipboard`,
                          duration: 2000,
                        });
                      },
                    },
                    options: {
                      duration: 600,
                    },
                  }}
                  feedback={{
                    enabled: true,
                    variant: "ring",
                    showProgress: true,
                    color: "secondary",
                  }}
                  style={{
                    opacity: allButtonsStagger.items[index + 1]?.opacity ?? 0,
                    transform:
                      allButtonsStagger.items[index + 1]?.transform ??
                      "translateY(20px) scale(0.95)",
                    transition:
                      allButtonsStagger.items[index + 1]?.transition ?? "none",
                  }}
                >
                  <Button
                    ref={socialLinksMagnetic[index].ref}
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
                    onClick={() => window.open(social.url, '_blank')}
                    ripple={true}
                    magnetic={true}
                    clickAnimation={true}
                  >
                    <social.icon size={24} />
                    <span>{social.name.toUpperCase()}</span>
                    <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
                  </Button>
                </GestureWrapper>
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
}: {
  upcomingParties: Array<PartyEvent>;
  isVisible: boolean;
}) => {
  // Scroll animations for parties page
  const partiesStagger = useStaggerReveal<HTMLDivElement>(upcomingParties.length, {
    staggerDelay: 200,
    duration: 700,
    threshold: 0.1,
    once: false,
  });
  
  // Mouse parallax for party cards with staggered depth - create individual hooks
  const card1Parallax = useMouseParallax<HTMLDivElement>(0.02, { maxOffset: 20 });
  const card2Parallax = useMouseParallax<HTMLDivElement>(0.025, { maxOffset: 23 });
  const card3Parallax = useMouseParallax<HTMLDivElement>(0.03, { maxOffset: 26 });
  
  // Magnetic hover for GET TICKETS buttons - create individual hooks
  const ticket1Magnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.3, maxDistance: 100 });
  const ticket2Magnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.3, maxDistance: 100 });
  const ticket3Magnetic = useMagneticHover<HTMLButtonElement>({ strength: 0.3, maxDistance: 100 });
  
  // Create arrays for easier access
  const cardsParallax = [card1Parallax, card2Parallax, card3Parallax];
  const ticketButtonsMagnetic = [ticket1Magnetic, ticket2Magnetic, ticket3Magnetic];

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
            gridTemplateColumns: { base: '1', md: '2', lg: '4' },
            gap: { base: '4', md: '6' },
            maxWidth: '7xl',
            marginX: 'auto'
          })}
        >
          {upcomingParties.map((party: PartyEvent, index: number) => {
            // Combine parallax and stagger transforms
            const parallaxTransform = cardsParallax[index]?.styles?.transform || 'translate3d(0, 0, 0)';
            const staggerTransform = partiesStagger.items[index]?.transform || '';
            const combinedTransform = staggerTransform ? 
              `${parallaxTransform} ${staggerTransform}` : 
              parallaxTransform;
            
            return (
              <div
                key={party.id}
                ref={cardsParallax[index].ref}
                className={css({
                  border: '4px solid white',
                  backgroundColor: 'black',
                  color: 'white',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(0.125rem)',
                  _hover: {
                    backgroundColor: 'white',
                    color: 'black'
                  }
                })}
                style={{
                  opacity: partiesStagger.items[index]?.opacity ?? 0,
                  transform: combinedTransform,
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out',
                  willChange: 'transform, opacity',
                }}
              >
              {/* Poster */}
              <div className={css({
                aspectRatio: '3/4',
                borderBottom: '4px solid white',
                position: 'relative',
                overflow: 'hidden'
              })}>
                <Image
                  src={party.poster || "/images/flyer4.png"}
                  alt={party.title}
                  fill
                  className={css({
                    objectFit: 'cover',
                    transition: 'all 0.2s',
                    '.group:hover &': {
                      filter: 'invert(1)'
                    }
                  })}
                />
              </div>

              {/* Event Details */}
              <div className={css({
                padding: '4',
                '& > * + *': {
                  marginTop: '3'
                }
              })}>
                <h3 className={css({
                  fontSize: { base: 'lg', md: 'xl' },
                  fontWeight: 'black',
                  letterSpacing: 'tighter'
                })}>
                  {party.title}
                </h3>

                <div className={css({
                  '& > * + *': {
                    marginTop: '2'
                  },
                  fontSize: { base: 'sm', md: 'base' },
                  fontWeight: 'bold'
                })}>
                  <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2'
                  })}>
                    <Calendar size={16} />
                    <span>
                      {new Date(party.date)
                        .toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2'
                  })}>
                    <Clock size={16} />
                    <span>{party.time}</span>
                  </div>

                  <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2'
                  })}>
                    <MapPin size={16} />
                    <span>{party.venue}</span>
                  </div>

                  <div className={css({
                    fontSize: 'xs',
                    fontWeight: 'black',
                    letterSpacing: 'wider'
                  })}>
                    {party.location}
                  </div>
                </div>

                <Button
                  ref={ticketButtonsMagnetic[index].ref}
                  className={css({
                    width: 'full',
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    color: 'white',
                    fontWeight: 'black',
                    _hover: {
                      backgroundColor: 'white',
                      color: 'black'
                    },
                    '.group:hover &': {
                      backgroundColor: 'black',
                      color: 'white',
                      borderColor: 'black'
                    }
                  })}
                  onClick={() => window.open('https://hdfst.uk/e132325', '_blank')}
                  ripple={true}
                  clickAnimation={true}
                  magnetic={true}
                >
                  GET TICKETS
                </Button>
              </div>
            </div>
            );
          })}
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
  
  // Magnetic effect for navigation header text
  const magnetic = useSimpleMagneticHover<HTMLDivElement>('strong');
  
  // Mouse parallax for header (closest layer - minimal movement)
  const headerParallax = useMouseParallax<HTMLDivElement>(0.01, { maxOffset: 10 });
  
  // Mouse parallax for navigation buttons (slightly more movement than header)
  const navButtonsParallax = useMouseParallax<HTMLDivElement>(0.015, { maxOffset: 12 });

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

  const upcomingParties = [
    {
      id: 1,
      title: "WIBBLY WOBBLAZ - LAUNCH PARTY",
      date: "2025-08-30",
      time: "22:00",
      venue: "THE PACKHORSE SECRET CELLAR",
      location: "BS5 0DN",
      poster: "/images/2/posterflyer 4.png",
      ticketLink: "https://hdfst.uk/e132325",
    },
    {
      id: 2,
      title: "HOT ONES - EP01",
      date: "2025-08-16",
      time: "22:00",
      venue: "DIXIES CHICKEN SHOP",
      location: "BS1 3QU",
      poster: "/images/1/output.gif",
      hotOnes: true,
    },
    {
      id: 3,
      title: "HOT ONES - EP02",
      date: "2025-09-20",
      time: "22:00",
      venue: "THE STAR AND GARTER",
      location: "BS6 5LR",
      poster: "/images/3/STGARTER.png",
      hotOnes: true,
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/wibblywobblaz",
    },
    {
      name: "SoundCloud",
      icon: Music,
      url: "https://soundcloud.com/wibblywobblaz",
    },
  ];

  return (
    <div className={css({
      position: 'fixed',
      inset: '0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    })}>
      {/* Shared Navigation */}
      <nav
        className={css({
          borderBottom: '4px solid',
          borderColor: currentPage === "parties" ? "white" : "black",
          backgroundColor: currentPage === "parties" ? "black" : "white",
          color: currentPage === "parties" ? "white" : "black",
          padding: { base: '4', md: '6' },
          flexShrink: '0',
          zIndex: 50
        })}
      >
        <div className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        })}>
          <div
            ref={(el) => {
              magnetic.ref.current = el;
              headerParallax.ref.current = el;
            }}
            className={css({
              fontSize: 'brand',
              fontWeight: '900',
              letterSpacing: 'tighter',
              fontFamily: 'hegval',
              whiteSpace: 'nowrap', // Prevent wrapping at all viewport sizes
              cursor: 'pointer',
              userSelect: 'none',
              color: currentPage === "parties" ? "white" : "black",
              position: 'relative',
              zIndex: 10,
              transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform'
            })}
            style={{ 
              ...headerParallax.styles
            }}
          >
            WIBBLY WOBBLAZ
          </div>

          {/* Desktop Navigation */}
          <div 
            ref={navButtonsParallax.ref}
            className={css({
              display: { base: 'none', md: 'flex' },
              gap: '8'
            })}
            style={{
              ...navButtonsParallax.styles,
              transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
            }}
          >
            <Button
              variant="ghost"
              className={css({
                fontSize: 'xl',
                fontWeight: 'black',
                backgroundColor: currentPage === "links" ? "black" : "transparent",
                color: currentPage === "links" 
                  ? "white" 
                  : currentPage === "parties" 
                    ? "white" 
                    : "black",
                _hover: currentPage === "links"
                  ? { backgroundColor: 'gray.800' }
                  : currentPage === "parties"
                    ? { backgroundColor: 'white', color: 'black' }
                    : { backgroundColor: 'black', color: 'white' }
              })}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
              ripple={true}
              clickAnimation={true}
              magnetic={true}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={css({
                fontSize: 'xl',
                fontWeight: 'black',
                backgroundColor: currentPage === "parties" ? "white" : "transparent",
                color: currentPage === "parties" 
                  ? "black" 
                  : currentPage === "links" 
                    ? "black" 
                    : "white",
                _hover: currentPage === "parties"
                  ? { backgroundColor: 'gray.200' }
                  : currentPage === "links"
                    ? { backgroundColor: 'black', color: 'white' }
                    : { backgroundColor: 'white', color: 'black' }
              })}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
              ripple={true}
              clickAnimation={true}
              magnetic={true}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className={css({
              display: { base: 'block', md: 'none' },
              padding: '2',
              color: currentPage === "parties" ? "white" : "black",
              _hover: currentPage === "parties" 
                ? { backgroundColor: 'white', color: 'black' }
                : {}
            })}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            ripple={true}
            clickAnimation={true}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className={css({
              display: { base: 'block', md: 'none' },
              marginTop: '4',
              borderTop: '2px solid',
              borderColor: currentPage === "parties" ? "white" : "black",
              paddingTop: '4'
            })}
          >
            <div className={css({
              display: 'flex',
              flexDirection: 'column',
              '& > * + *': {
                marginTop: '2'
              }
            })}>
              <Button
                variant="ghost"
                className={css({
                  fontSize: 'xl',
                  fontWeight: 'black',
                  justifyContent: 'flex-start',
                  backgroundColor: currentPage === "links" ? "black" : "transparent",
                  color: currentPage === "links" 
                    ? "white" 
                    : currentPage === "parties" 
                      ? "white" 
                      : "black",
                  _hover: currentPage === "links"
                    ? {}
                    : currentPage === "parties"
                      ? { backgroundColor: 'white', color: 'black' }
                      : { backgroundColor: 'black', color: 'white' }
                })}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
                ripple={true}
                clickAnimation={true}
                magnetic={true}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={css({
                  fontSize: 'xl',
                  fontWeight: 'black',
                  justifyContent: 'flex-start',
                  backgroundColor: currentPage === "parties" ? "white" : "transparent",
                  color: currentPage === "parties" 
                    ? "black" 
                    : currentPage === "links" 
                      ? "black" 
                      : "white",
                  _hover: currentPage === "parties"
                    ? {}
                    : currentPage === "links"
                      ? { backgroundColor: 'black', color: 'white' }
                      : { backgroundColor: 'white', color: 'black' }
                })}
                onClick={() => handlePageTransition("parties")}
                disabled={isTransitioning}
                ripple={true}
                clickAnimation={true}
                magnetic={true}
              >
                PARTIES
              </Button>
            </div>
          </div>
        )}
      </nav>

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
            className={css({
              position: 'absolute',
              inset: '0',
              transition: 'transform 0.7s ease-in-out',
              transform: currentPage === "parties" ? 'translateX(0)' : 'translateX(100%)'
            })}
          >
            <PartiesPage
              upcomingParties={upcomingParties}
              isVisible={currentPage === "parties"}
            />
          </div>
        </div>
      </div>

      {/* PandaCSS Test Component - for hot reload testing */}
      <div className={css({
        position: 'absolute',
        top: '0',
        right: '0',
        zIndex: '50'
      })}>
        <PandaTestComponent />
      </div>

      {/* Performance Overlay (Development Only) */}
      <AnimationPerformanceOverlay />
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import { useSimpleFadeIn } from "@/hooks/use-scroll-animations";
import { calculateParallaxTransform, type MousePosition } from "@/hooks/use-shared-mouse";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";
import { GestureWrapper } from "@/components/ui/gesture-wrapper";
import { toast } from "@/components/ui/use-toast";
import { SocialLinkButton } from "@/components/wibbly/social-link-button";
import { css } from "@/styled-system/css";
import { SocialLink } from "@/types";

export interface LinksPageProps {
  socialLinks: Array<SocialLink>;
  isVisible: boolean;
  mousePosition?: MousePosition;
}

export const LinksPage: React.FC<LinksPageProps> = ({
  socialLinks,
  isVisible,
  mousePosition,
}) => {
  // Unified stagger animation for all elements (3 headers + 4 buttons = 7 total)
  const logoFadeIn = useSimpleFadeIn("left");
  const allButtonsStagger = useStaggerReveal<HTMLDivElement>(7, {
    staggerDelay: 150,
    duration: 600,
    threshold: 0.1,
    once: false,
  });
  
  // Refs for parallax calculations
  const logoRef = React.useRef<HTMLDivElement>(null);
  const linksRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const logoContainerRef = React.useRef<HTMLDivElement>(null);
  
  // State for logo scaling and container height on scroll
  const [logoScale, setLogoScale] = React.useState(1);
  const [containerHeight, setContainerHeight] = React.useState('100%');
  
  // Calculate parallax transforms using shared mouse position
  const logoParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    return calculateParallaxTransform(logoRef.current, mousePosition, 0.05, 30);
  }, [mousePosition]);
  
  const linksParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    return calculateParallaxTransform(linksRef.current, mousePosition, 0.02, 15);
  }, [mousePosition]);
  
  // Magnetic effects for link buttons - create individual hooks
  const ticketLinkMagnetic = useMagneticHover<HTMLButtonElement>({ 
    strength: 0.25, 
    maxDistance: 100, 
    boundaries: { x: 0.4, y: 0.4 }, 
    lerp: 0.12 
  });
  const merchLinkMagnetic = useMagneticHover<HTMLButtonElement>({ 
    strength: 0.25, 
    maxDistance: 100, 
    boundaries: { x: 0.4, y: 0.4 }, 
    lerp: 0.12 
  });

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
  
  // Handle scroll event for logo scaling
  React.useEffect(() => {
    const handleScroll = () => {
      // Always use the scroll container
      const scrollElement = scrollContainerRef.current;
      
      if (!scrollElement) return;
      
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
      
      // Calculate scroll progress (0 to 1)
      const scrollProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      
      // Map scroll progress to scale (1 → 0.6)
      // Using easing for smoother scaling
      const minScale = 0.6;
      const maxScale = 1;
      const scale = maxScale - (scrollProgress * (maxScale - minScale));
      
      setLogoScale(scale);
      
      // Disabled container height animation to prevent spring back
      // The height changes were causing layout recalculations that interfered with scrolling
      /* 
      if (isMobile) {
        // Calculate container height for mobile (100% → 30%)
        const minHeightPercent = 30;
        const maxHeightPercent = 100;
        const heightPercent = maxHeightPercent - (scrollProgress * (maxHeightPercent - minHeightPercent));
        setContainerHeight(`${heightPercent}%`);
      } else {
        // Reset to full height on desktop
        setContainerHeight('100%');
      }
      */
    };
    
    const handleResize = () => {
      // No longer needed since container height animation is disabled
      // Keeping for potential future use
    };
    
    // Handle wheel events on logo container (desktop only)
    const handleLogoWheel = (e: WheelEvent) => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile && scrollContainerRef.current) {
        // Prevent default to avoid any conflicting scroll behavior
        e.preventDefault();
        // Forward the scroll to the links container
        scrollContainerRef.current.scrollBy({
          top: e.deltaY,
          behavior: 'auto'
        });
      }
    };
    
    const scrollElement = scrollContainerRef.current;
    const logoElement = logoContainerRef.current;
    
    if (scrollElement) {
      // Add scroll listener to scroll container
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);
      
      // Add wheel event listener to logo container for desktop only
      const isMobile = window.innerWidth < 768;
      if (logoElement && !isMobile) {
        logoElement.addEventListener('wheel', handleLogoWheel, { passive: false });
      }
      
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (logoElement) {
          logoElement.removeEventListener('wheel', handleLogoWheel);
        }
      };
    }
  }, []);

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
    <div 
      data-links-page-container
      className={css({
        height: 'full',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        position: 'relative',
        overflow: 'hidden'
      })}>
      {/* Left Side - Logo */}
      <div 
        ref={logoContainerRef}
        className={css({
          display: { base: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8',
          backgroundColor: 'white',
          flex: '1',
          height: 'full',
          zIndex: 1
        })}>
        <div
          ref={(el) => {
            logoFadeIn.ref.current = el;
            logoRef.current = el;
          }}
          className={css({
            width: 'full',
            maxWidth: 'lg',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          })}
          style={{
            ...logoFadeIn.styles,
            transform: logoParallaxTransform,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          <Image
            src="/images/wibbly-wobblaz-logo.png"
            alt="WIBBLY WOBBLAZ"
            width={500}
            height={400}
            style={{
              width: `${logoScale * 100}%`,
              height: 'auto',
              maxWidth: '500px',
              transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            priority
          />
        </div>
      </div>

      {/* Right Side - Links (includes logo on mobile) */}
      <div 
        ref={scrollContainerRef}
        className={css({
          flex: '1',
          backgroundColor: { base: 'white', md: 'black' },
          color: { base: 'black', md: 'white' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { base: 'flex-start', md: 'center' },
          height: 'full',
          zIndex: 2,
          overflowY: 'auto',
          overflowX: 'hidden'
        })}>
        {/* Mobile Logo - shown only on mobile */}
        <div className={css({
          display: { base: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4',
          backgroundColor: 'white'
        })}>
          <div className={css({
            width: 'full',
            maxWidth: 'lg',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          })}>
            <Image
              src="/images/wibbly-wobblaz-logo.png"
              alt="WIBBLY WOBBLAZ"
              width={500}
              height={400}
              style={{
                width: `${logoScale * 100}%`,
                height: 'auto',
                maxWidth: '500px',
                transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              priority
            />
          </div>
        </div>
        
        {/* Links Content */}
        <div 
          ref={linksRef}
          className={css({
            backgroundColor: 'black',
            color: 'white',
            padding: { base: '4', md: '8' },
            flex: { md: '1' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { md: 'center' }
          })}>
          <div className={css({
            '& > * + *': {
              marginTop: { base: '6', md: '8' }
            }
          })}
          style={{
            transform: linksParallaxTransform,
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
                <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
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
                <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
              </Button>
            </GestureWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
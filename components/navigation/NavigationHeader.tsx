"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSimpleMagneticHover } from "@/hooks/use-magnetic-hover";
import { calculateParallaxTransform, type MousePosition } from "@/hooks/use-shared-mouse";
import { css } from "@/styled-system/css";

interface NavigationHeaderProps {
  currentPage: "links" | "parties";
  mobileMenuOpen: boolean;
  isTransitioning: boolean;
  mousePosition?: MousePosition;
  onPageTransition: (targetPage: "links" | "parties") => void;
  onMobileMenuToggle: () => void;
}

export function NavigationHeader({
  currentPage,
  mobileMenuOpen,
  isTransitioning,
  mousePosition,
  onPageTransition,
  onMobileMenuToggle,
}: NavigationHeaderProps) {
  // Magnetic effect for navigation header text
  const magnetic = useSimpleMagneticHover<HTMLDivElement>('strong');
  
  // Magnetic effects for ellipsis dots
  const magneticDot1 = useSimpleMagneticHover<HTMLDivElement>('strong');
  const magneticDot2 = useSimpleMagneticHover<HTMLDivElement>('strong');
  const magneticDot3 = useSimpleMagneticHover<HTMLDivElement>('strong');
  
  // Refs for parallax calculations
  const headerRef = React.useRef<HTMLDivElement>(null);
  const navButtonsRef = React.useRef<HTMLDivElement>(null);
  const dot1Ref = React.useRef<HTMLDivElement>(null);
  const dot2Ref = React.useRef<HTMLDivElement>(null);
  const dot3Ref = React.useRef<HTMLDivElement>(null);
  
  // Calculate parallax transforms using shared mouse position
  const headerParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    return calculateParallaxTransform(headerRef.current, mousePosition, 0.01, 10);
  }, [mousePosition]);
  
  const navButtonsParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    return calculateParallaxTransform(navButtonsRef.current, mousePosition, 0.015, 12);
  }, [mousePosition]);
  
  // Calculate parallax transforms for ellipsis dots with strong intensity
  // Reduced left and bottom travel by clamping negative values
  const dot1ParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    const transform = calculateParallaxTransform(dot1Ref.current, mousePosition, 0.03, 20);
    // Parse and clamp the transform values to reduce left and bottom movement
    const match = transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px, ([-\d.]+)px\)/);
    if (match) {
      const x = Math.max(parseFloat(match[1]), -5); // Limit left movement to -5px
      const y = Math.min(parseFloat(match[2]), 5); // Limit bottom movement to 5px
      return `translate3d(${x}px, ${y}px, ${match[3]}px)`;
    }
    return transform;
  }, [mousePosition]);
  
  const dot2ParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    const transform = calculateParallaxTransform(dot2Ref.current, mousePosition, 0.035, 22);
    const match = transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px, ([-\d.]+)px\)/);
    if (match) {
      const x = Math.max(parseFloat(match[1]), -6);
      const y = Math.min(parseFloat(match[2]), 6);
      return `translate3d(${x}px, ${y}px, ${match[3]}px)`;
    }
    return transform;
  }, [mousePosition]);
  
  const dot3ParallaxTransform = React.useMemo(() => {
    if (!mousePosition) return 'translate3d(0, 0, 0)';
    const transform = calculateParallaxTransform(dot3Ref.current, mousePosition, 0.04, 25);
    const match = transform.match(/translate3d\(([-\d.]+)px, ([-\d.]+)px, ([-\d.]+)px\)/);
    if (match) {
      const x = Math.max(parseFloat(match[1]), -7);
      const y = Math.min(parseFloat(match[2]), 7);
      return `translate3d(${x}px, ${y}px, ${match[3]}px)`;
    }
    return transform;
  }, [mousePosition]);

  return (
    <nav
      className={css({
        borderBottom: '4px solid',
        borderColor: currentPage === "parties" ? "white" : "black",
        backgroundColor: currentPage === "parties" ? "black" : "white",
        color: currentPage === "parties" ? "white" : "black",
        padding: 'fluid-md',  // Fluid padding that scales from 1rem to 1.5rem
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
            headerRef.current = el;
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
            transform: headerParallaxTransform
          }}
        >
          WIBBLY WOBBLAZ
        </div>

        {/* Desktop Navigation */}
        <div 
          ref={navButtonsRef}
          className={css({
            display: { base: 'none', md: 'flex' },
            gap: '8'
          })}
          style={{
            transform: navButtonsParallaxTransform,
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
            onClick={() => onPageTransition("links")}
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
            onClick={() => onPageTransition("parties")}
            disabled={isTransitioning}
            ripple={true}
            clickAnimation={true}
            magnetic={true}
          >
            PARTIES
          </Button>
        </div>

        {/* Mobile Menu Button - 3 Dots Ellipsis */}
        <Button
          variant="ghost"
          className={css({
            display: { base: 'flex', md: 'none' },
            padding: '4',
            gap: '2',
            alignItems: 'center',
            backgroundColor: 'transparent',
            overflow: 'visible',
            isolation: 'isolate',
            _hover: {
              '& > div:first-child': {
                transform: 'scale(1.2) translateY(-2px)',
              },
              '& > div:nth-child(2)': {
                transform: 'scale(1.15)',
              },
              '& > div:last-child': {
                transform: 'scale(1.2) translateY(-2px)', 
              }
            }
          })}
          onClick={onMobileMenuToggle}
          ripple={true}
          clickAnimation={true}
          magnetic={true}
        >
          {mobileMenuOpen ? (
            <X size={32} strokeWidth={3} color={currentPage === "parties" ? "white" : "black"} />
          ) : (
            <>
              {/* First dot */}
              <div 
                ref={(el) => {
                  magneticDot1.ref.current = el;
                  dot1Ref.current = el;
                }}
                className={css({
                  width: '2.5',
                  height: '2.5',
                  borderRadius: 'full',
                  backgroundColor: currentPage === "parties" ? "white" : "black",
                  transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                  position: 'relative',
                  zIndex: 3
                })}
                style={{ 
                  transform: `${dot1ParallaxTransform} ${magneticDot1.transform ? `translate(${magneticDot1.transform.x}px, ${magneticDot1.transform.y}px)` : ''}`
                }}
              />
              {/* Middle dot */}
              <div 
                ref={(el) => {
                  magneticDot2.ref.current = el;
                  dot2Ref.current = el;
                }}
                className={css({
                  width: '3', 
                  height: '3',
                  borderRadius: 'full',
                  backgroundColor: currentPage === "parties" ? "white" : "black",
                  transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                  position: 'relative',
                  zIndex: 2
                })}
                style={{ 
                  transform: `${dot2ParallaxTransform} ${magneticDot2.transform ? `translate(${magneticDot2.transform.x}px, ${magneticDot2.transform.y}px)` : ''}`
                }}
              />
              {/* Third dot */}
              <div 
                ref={(el) => {
                  magneticDot3.ref.current = el;
                  dot3Ref.current = el;
                }}
                className={css({
                  width: '2.5',
                  height: '2.5', 
                  borderRadius: 'full',
                  backgroundColor: currentPage === "parties" ? "white" : "black",
                  transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                  position: 'relative',
                  zIndex: 1
                })}
                style={{ 
                  transform: `${dot3ParallaxTransform} ${magneticDot3.transform ? `translate(${magneticDot3.transform.x}px, ${magneticDot3.transform.y}px)` : ''}`
                }}
              />
            </>
          )}
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
              onClick={() => onPageTransition("links")}
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
              onClick={() => onPageTransition("parties")}
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
  );
}
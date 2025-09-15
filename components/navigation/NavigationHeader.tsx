"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSimpleMagneticHover } from "@/hooks/use-magnetic-hover";
import { useMouseParallax } from "@/hooks/use-parallax";
import { css } from "@/styled-system/css";

interface NavigationHeaderProps {
  currentPage: "links" | "parties";
  mobileMenuOpen: boolean;
  isTransitioning: boolean;
  onPageTransition: (targetPage: "links" | "parties") => void;
  onMobileMenuToggle: () => void;
}

export function NavigationHeader({
  currentPage,
  mobileMenuOpen,
  isTransitioning,
  onPageTransition,
  onMobileMenuToggle,
}: NavigationHeaderProps) {
  // Magnetic effect for navigation header text
  const magnetic = useSimpleMagneticHover<HTMLDivElement>('strong');
  
  // Mouse parallax for header (closest layer - minimal movement)
  const headerParallax = useMouseParallax<HTMLDivElement>(0.01, { maxOffset: 10 });
  
  // Mouse parallax for navigation buttons (slightly more movement than header)
  const navButtonsParallax = useMouseParallax<HTMLDivElement>(0.015, { maxOffset: 12 });

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
          onClick={onMobileMenuToggle}
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
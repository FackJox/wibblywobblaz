"use client";

import { useState, useEffect, useRef } from "react";
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
import Link from "next/link";
import { PandaTestComponent } from "@/components/test-panda";
import { css } from "../styled-system/css";
import { cx } from "../styled-system/css";
import {
  pageContainer,
  pageTransitionWrapper,
  pageWrapper,
  pageContent,
  navigation,
  navigationContainer,
  brandText,
  desktopNavigation,
  navigationButton,
  mobileMenuButton,
  mobileNavigation,
  mobileNavigationContainer,
  scrollableContent,
  linksPageLayout,
  logoSection,
  linksSection,
  partiesPageContent,
  partiesGrid
} from "../styled-system/recipes";

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

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shhhState, setShhhState] = useState<
    "hidden" | "animating" | "visible"
  >("hidden");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const freeButtonRef = useRef<HTMLButtonElement>(null);

  const handlePageTransition = (targetPage: "links" | "parties") => {
    if (targetPage === currentPage) return;

    setIsTransitioning(true);
    setMobileMenuOpen(false);
    setCurrentPage(targetPage);

    // Allow CSS transition to complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
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

  const upcomingParties = [
    {
      id: 1,
      title: "WIBBLY WOBBLAZ - LAUNCH PARTY",
      date: "2025-08-30",
      time: "22:00",
      venue: "THE PACKHORSE SECRET CELLAR",
      location: "BRISTOL",
      poster: "/images/2/posterflyer 4.png",
      ticketLink: "https://hdfst.uk/e132325",
    },
    {
      id: 2,
      title: "HOT ONES - EP01",
      date: "2025-08-16",
      time: "22:00",
      venue: "DIXIES CHICKEN SHOP",
      location: "BRISTOL",
      poster: "/images/1/output.gif",
      hotOnes: true,
    },
    {
      id: 3,
      title: "HOT ONES - EP02",
      date: "2025-09-20",
      time: "22:00",
      venue: "?????",
      location: "BRISTOL",
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

  const LinksPage = () => (
    <div className={pageContent({ theme: 'light' })}>
      {/* Sticky Navigation */}
      <nav className={navigation({ theme: 'light' })}>
        <div className={navigationContainer()}>
          <div className={brandText({ theme: 'light', size: 'md' })}>
            WIBBLY WOBBLAZ
          </div>

          {/* Desktop Navigation */}
          <div className={desktopNavigation({ responsive: 'visible' })}>
            <Button
              variant="ghost"
              className={navigationButton({ 
                theme: 'light', 
                active: currentPage === "links" 
              })}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={navigationButton({ 
                theme: 'light', 
                active: currentPage === "parties" 
              })}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className={mobileMenuButton({ responsive: 'hidden', theme: 'light' })}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={mobileNavigation({ visible: true, theme: 'light' })}>
            <div className={mobileNavigationContainer()}>
              <Button
                variant="ghost"
                className={cx(
                  navigationButton({ 
                    theme: 'light', 
                    active: currentPage === "links" 
                  }),
                  css({ justifyContent: 'flex-start' })
                )}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={cx(
                  navigationButton({ 
                    theme: 'light', 
                    active: currentPage === "parties" 
                  }),
                  css({ justifyContent: 'flex-start' })
                )}
                onClick={() => handlePageTransition("parties")}
                disabled={isTransitioning}
              >
                PARTIES
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div
        ref={scrollContainerRef}
        className={scrollableContent({ scrollable: true })}
      >
        <div className={css({ height: 'full' })}>
          {/* Responsive layout: desktop (no scroll) vs mobile (scrollable) */}
          <div className={linksPageLayout({ responsive: 'desktop' })}>
            {/* Left Side - Logo */}
            <div className={logoSection({ responsive: 'desktop' })}>
              <div className={css({ maxWidth: 'lg', width: 'full' })}>
                <Image
                  src="/images/wibbly-wobblaz-logo.png"
                  alt="WIBBLY WOBBLAZ"
                  width={500}
                  height={400}
                  className={css({ width: 'full', height: 'auto' })}
                  priority
                />
              </div>
            </div>

            {/* Right Side - Links */}
            <div className={linksSection({ responsive: 'desktop' })}>
              <div className={css({ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'fluid-lg'
              })}>
                {/* Social Links */}
                <div className={css({ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'fluid-md'
                })}>
                  <h2 className={css({
                    fontSize: 'fluid-lg',
                    fontWeight: '900',
                    letterSpacing: 'tighter',
                    borderBottomWidth: '2px',
                    borderBottomColor: 'white',
                    paddingBottom: '2'
                  })}>
                    FOLLOW US
                  </h2>
                  <div className={css({ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3'
                  })}>
                    {socialLinks.map((social) => (
                      <Link
                        key={social.name}
                        href={social.url}
                        className={css({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3',
                          fontSize: 'fluid-base',
                          fontWeight: '700',
                          padding: '3',
                          borderWidth: '2px',
                          borderColor: 'white',
                          transition: 'colors 0.2s ease-in-out',
                          _hover: {
                            backgroundColor: 'white',
                            color: 'black'
                          }
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon size={24} />
                        <span>{social.name.toUpperCase()}</span>
                        <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tickets */}
                <div className={css({ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'fluid-md'
                })}>
                  <h2 className={css({
                    fontSize: 'fluid-lg',
                    fontWeight: '900',
                    letterSpacing: 'tighter',
                    borderBottomWidth: '2px',
                    borderBottomColor: 'white',
                    paddingBottom: '2'
                  })}>
                    GET TICKETS
                  </h2>
                  <Link
                    href="https://hdfst.uk/e132325"
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3',
                      fontSize: 'fluid-base',
                      fontWeight: '700',
                      padding: '3',
                      borderWidth: '2px',
                      borderColor: 'white',
                      transition: 'colors 0.2s ease-in-out',
                      _hover: {
                        backgroundColor: 'white',
                        color: 'black'
                      }
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar size={24} />
                    <span>HEADFIRST</span>
                    <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
                  </Link>
                </div>

                {/* Merch */}
                <div className={css({ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'fluid-md',
                  paddingBottom: 'fluid-xl'
                })}>
                  <h2 className={css({
                    fontSize: 'fluid-lg',
                    fontWeight: '900',
                    letterSpacing: 'tighter',
                    borderBottomWidth: '2px',
                    borderBottomColor: 'white',
                    paddingBottom: '2'
                  })}>
                    MERCH STORE
                  </h2>
                  <Link
                    href="https://merch.wibblywobblaz.xyz"
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3',
                      fontSize: 'fluid-base',
                      fontWeight: '700',
                      padding: '3',
                      borderWidth: '2px',
                      borderColor: 'white',
                      transition: 'colors 0.2s ease-in-out',
                      _hover: {
                        backgroundColor: 'white',
                        color: 'black'
                      }
                    })}
                  >
                    <ShoppingBag size={20} />
                    <span>SHOP NOW</span>
                    <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PartiesPage = () => (
    <div className={pageContent({ theme: 'dark' })}>
      {/* Navigation */}
      <nav className={navigation({ theme: 'dark' })}>
        <div className={navigationContainer()}>
          <div className={brandText({ theme: 'dark', size: 'md' })}>
            UPCOMING PARTIES
          </div>

          {/* Desktop Navigation */}
          <div className={desktopNavigation({ responsive: 'visible' })}>
            <Button
              variant="ghost"
              className={navigationButton({ 
                theme: 'dark', 
                active: currentPage === "links" 
              })}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={navigationButton({ 
                theme: 'dark', 
                active: currentPage === "parties" 
              })}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className={mobileMenuButton({ responsive: 'hidden', theme: 'dark' })}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={mobileNavigation({ visible: true, theme: 'dark' })}>
            <div className={mobileNavigationContainer()}>
              <Button
                variant="ghost"
                className={cx(
                  navigationButton({ 
                    theme: 'dark', 
                    active: currentPage === "links" 
                  }),
                  css({ justifyContent: 'flex-start' })
                )}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={cx(
                  navigationButton({ 
                    theme: 'dark', 
                    active: currentPage === "parties" 
                  }),
                  css({ justifyContent: 'flex-start' })
                )}
                onClick={() => handlePageTransition("parties")}
                disabled={isTransitioning}
              >
                PARTIES
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area with Shhh SVG */}
      <div className={cx(
        scrollableContent({ scrollable: true }),
        css({ position: 'relative' })
      )}>
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
              zIndex: '50'
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
            transition: shhhState === "animating" ? "none" : "transform 0ms",
            opacity:
              shhhState === "animating" || shhhState === "visible" ? 1 : 0,
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === "slideUpBounce") {
              setShhhState("visible");
              setCurrentPage("links");
              window.open("https://instagram.com/wibblywobblaz", "_blank");
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
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
                display: "block",
              }}
              priority
            />
          </div>
        </div>

        {/* Party content overlay */}
        {/* Poster */}
        {/* Event Details */}
        <div className={partiesPageContent({ responsive: 'desktop' })}>
          <div className={partiesGrid({ responsive: 'desktop' })}>
            {upcomingParties.map((party, index) => (
              <div
                key={party.id}
                className={cx('group', css({
                  borderWidth: '4px',
                  borderColor: 'white',
                  backgroundColor: 'black',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  backdropBlur: 'sm',
                  opacity: '0.9',
                  _hover: {
                    backgroundColor: 'white',
                    color: 'black'
                  }
                }))}
              >
                <div className={css({
                  aspectRatio: '3/4',
                  borderBottomWidth: '4px',
                  borderBottomColor: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                })}>
                  <Image
                    src={party.poster || "/images/flyer4.png"}
                    alt={party.title}
                    fill
                    className={css({
                      objectFit: 'cover',
                      transition: 'all 0.2s ease',
                      _groupHover: {
                        filter: 'invert(1)'
                      }
                    })}
                  />
                </div>

                <div className={css({
                  padding: 'fluid-md',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3'
                })}>
                  <h3 className={css({
                    fontSize: 'fluid-base',
                    fontWeight: '900',
                    letterSpacing: 'tighter'
                  })}>
                    {party.title}
                  </h3>

                  <div className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2',
                    fontSize: 'fluid-sm',
                    fontWeight: '700'
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
                      fontWeight: '900',
                      letterSpacing: 'wider'
                    })}>
                      {party.location}
                    </div>
                  </div>

                  {party.hotOnes ? (
                    <Button
                      ref={freeButtonRef}
                      onClick={handleFreeClick}
                      onKeyDown={handleFreeKeyDown}
                      aria-label="Free ticket - opens Instagram"
                      aria-pressed={shhhState === "animating"}
                      disabled={shhhState === "animating"}
                      className={css({
                        width: 'full',
                        backgroundColor: 'black',
                        borderWidth: '2px',
                        borderColor: 'white',
                        color: 'white',
                        fontWeight: '900',
                        transition: 'colors 0.2s ease',
                        _hover: {
                          backgroundColor: 'white',
                          color: 'black',
                          borderColor: 'black'
                        },
                        _disabled: {
                          opacity: '0.75',
                          cursor: 'not-allowed'
                        }
                      })}
                    >
                      {shhhState === "animating" ? "LOADING..." : "FREE"}
                    </Button>
                  ) : (
                    <Button
                      className={css({
                        width: 'full',
                        backgroundColor: 'black',
                        borderWidth: '2px',
                        borderColor: 'white',
                        color: 'white',
                        fontWeight: '900',
                        transition: 'colors 0.2s ease',
                        _hover: {
                          backgroundColor: 'white',
                          color: 'black',
                          borderColor: 'black'
                        }
                      })}
                      asChild
                    >
                      <Link
                        href={party.ticketLink || "https://hdfst.uk/e132325"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GET TICKETS
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={pageContainer()}>
      {/* PandaCSS Test Component - for hot reload testing */}
      <div className={css({ 
        position: 'absolute', 
        top: '0', 
        right: '0', 
        zIndex: '50' 
      })}>
        <PandaTestComponent />
      </div>
      {/* Pages Container */}
      <div
        className={pageTransitionWrapper({
          page: currentPage === "parties" ? "parties" : "links"
        })}
      >
        {/* Links Page */}
        <div className={pageWrapper()}>
          <LinksPage />
        </div>

        {/* Parties Page */}
        <div className={pageWrapper()}>
          <PartiesPage />
        </div>
      </div>
    </div>
  );
}

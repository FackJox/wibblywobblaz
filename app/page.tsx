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
import Link from "next/link";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import {
  useScrollFadeIn,
  useSimpleFadeIn,
} from "@/hooks/use-scroll-animations";
import { useSimpleParallax } from "@/hooks/use-parallax";
import { useHorizontalSwipeNavigation } from "@/hooks/use-swipe";
import { GestureWrapper } from "@/components/ui/gesture-wrapper";
import { toast } from "@/components/ui/use-toast";
import { AnimationPerformanceOverlay } from "@/components/dev/animation-performance-overlay";

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

// Define page components outside to prevent recreation
const LinksPage = ({
  socialLinks,
  isVisible,
}: {
  socialLinks: Array<{ name: string; icon: any; url: string }>;
  isVisible: boolean;
}) => {
  // Unified stagger animation for all elements (3 headers + 4 buttons = 7 total)
  const logoFadeIn = useSimpleFadeIn("left");
  const allButtonsStagger = useStaggerReveal(7, {
    staggerDelay: 150,
    duration: 600,
    threshold: 0.1,
    once: false,
  });

  // Reset animations when page becomes hidden
  React.useEffect(() => {
    if (!isVisible) {
      // Reset animations when page is hidden
      allButtonsStagger.reset();
      logoFadeIn.reset();
    } else {
      // Trigger animations when page becomes visible
      setTimeout(() => {
        allButtonsStagger.trigger();
        logoFadeIn.trigger();
      }, 100);
    }
  }, [isVisible]);

  return (
    <div className="h-full bg-white flex flex-col md:flex-row">
      {/* Left Side - Logo */}
      <div className="flex items-center justify-center p-4 md:p-8 bg-white md:flex-1 md:h-full">
        <div
          ref={logoFadeIn.ref}
          className="max-w-lg w-full"
          style={logoFadeIn.styles}
        >
          <Image
            src="/images/wibbly-wobblaz-logo.png"
            alt="WIBBLY WOBBLAZ"
            width={500}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Right Side - Links */}
      <div className="flex-1 bg-black text-white p-4 md:p-8 flex flex-col justify-center md:h-full">
        <div className="space-y-6 md:space-y-8">
          {/* Social Links */}
          <div className="space-y-4" ref={allButtonsStagger.containerRef}>
            <h2 
              className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2"
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
            <div className="space-y-3">
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
                  <Link
                    href={social.url}
                    className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-all duration-200 p-3 border-2 border-white hover:scale-[1.02] active:scale-[0.98]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={24} />
                    <span>{social.name.toUpperCase()}</span>
                    <ExternalLink size={20} className="ml-auto" />
                  </Link>
                </GestureWrapper>
              ))}
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-4">
            <h2 
              className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2"
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
              <Link
                href="https://hdfst.uk/e132325"
                className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-all duration-200 p-3 border-2 border-white hover:scale-[1.02] active:scale-[0.98]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar size={24} />
                <span>HEADFIRST</span>
                <ExternalLink size={20} className="ml-auto" />
              </Link>
            </GestureWrapper>
          </div>

          {/* Merch */}
          <div className="space-y-4 pb-10">
            <h2 
              className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2"
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
              <Link
                href="https://merch.wibblywobblaz.xyz"
                className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-all duration-200 p-3 border-2 border-white hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag size={20} />
                <span>SHOP NOW</span>
                <ExternalLink size={20} className="ml-auto" />
              </Link>
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
  upcomingParties: Array<any>;
  isVisible: boolean;
}) => {
  // Scroll animations for parties page
  const partiesStagger = useStaggerReveal(upcomingParties.length, {
    staggerDelay: 200,
    duration: 700,
    threshold: 0.1,
    once: false,
  });
  const backgroundParallax = useSimpleParallax(0.3);

  // Reset animations when page becomes hidden
  React.useEffect(() => {
    if (!isVisible) {
      // Reset animations when page is hidden
      partiesStagger.reset();
    } else {
      // Trigger animations when page becomes visible
      setTimeout(() => {
        partiesStagger.trigger();
      }, 100);
    }
  }, [isVisible]);

  return (
    <div className="h-full bg-black text-white overflow-y-auto">
      <div className="parties-content p-4 md:p-8">
        <div
          ref={partiesStagger.containerRef}
          className="parties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
        >
          {upcomingParties.map((party: any, index: number) => (
            <div
              key={party.id}
              className="parties-card border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-300 group backdrop-blur-sm bg-opacity-90"
              style={{
                opacity: partiesStagger.items[index]?.opacity ?? 0,
                transform:
                  partiesStagger.items[index]?.transform ??
                  "translateY(30px) scale(0.9)",
                transition: partiesStagger.items[index]?.transition ?? "none",
              }}
            >
              {/* Poster */}
              <div className="aspect-[3/4] border-b-4 border-white relative overflow-hidden">
                <Image
                  src={party.poster || "/images/flyer4.png"}
                  alt={party.title}
                  fill
                  className="object-cover group-hover:invert transition-all duration-200"
                />
              </div>

              {/* Event Details */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg md:text-xl font-black tracking-tighter">
                  {party.title}
                </h3>

                <div className="space-y-2 text-sm md:text-base font-bold">
                  <div className="flex items-center space-x-2">
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

                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{party.time}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{party.venue}</span>
                  </div>

                  <div className="text-xs font-black tracking-wider">
                    {party.location}
                  </div>
                </div>

                <Button
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black"
                  asChild
                  ripple={true}
                  clickAnimation={true}
                >
                  <Link
                    href="https://hdfst.uk/e132325"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GET TICKETS
                  </Link>
                </Button>
              </div>
            </div>
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
    <div className="fixed inset-0 overflow-hidden flex flex-col">
      {/* Shared Navigation */}
      <nav
        className={`sticky-nav border-b-4 ${currentPage === "parties" ? "border-white bg-black text-white" : "border-black bg-white text-black"} p-4 md:p-6 flex-shrink-0 z-50`}
      >
        <div className="flex justify-between items-center">
          <div
            className={`text-2xl md:text-7xl font-black tracking-tighter font-hegval ${currentPage === "parties" ? "text-white" : "text-black"}`}
          >
            {currentPage === "parties" ? "UPCOMING PARTIES" : "WIBBLY WOBBLAZ"}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Button
              variant="ghost"
              className={`text-xl font-black ${
                currentPage === "links"
                  ? "bg-black text-white hover:bg-gray-800"
                  : currentPage === "parties"
                    ? "text-white hover:bg-white hover:text-black"
                    : "hover:bg-black hover:text-white"
              }`}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
              ripple={true}
              clickAnimation={true}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={`text-xl font-black ${
                currentPage === "parties"
                  ? "bg-white text-black hover:bg-gray-200"
                  : currentPage === "links"
                    ? "text-black hover:bg-black hover:text-white"
                    : "hover:bg-white hover:text-black"
              }`}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
              ripple={true}
              clickAnimation={true}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className={`md:hidden p-2 ${currentPage === "parties" ? "text-white hover:bg-white hover:text-black" : ""}`}
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
            className={`md:hidden mt-4 border-t-2 ${currentPage === "parties" ? "border-white" : "border-black"} pt-4`}
          >
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className={`text-xl font-black justify-start ${
                  currentPage === "links"
                    ? "bg-black text-white"
                    : currentPage === "parties"
                      ? "text-white hover:bg-white hover:text-black"
                      : "hover:bg-black hover:text-white"
                }`}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
                ripple={true}
                clickAnimation={true}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={`text-xl font-black justify-start ${
                  currentPage === "parties"
                    ? "bg-white text-black"
                    : currentPage === "links"
                      ? "text-black hover:bg-black hover:text-white"
                      : "hover:bg-white hover:text-black"
                }`}
                onClick={() => handlePageTransition("parties")}
                disabled={isTransitioning}
                ripple={true}
                clickAnimation={true}
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
        className="flex-1 relative overflow-hidden"
        {...gestureHandlers}
      >
        <div className="relative w-full h-full">
          {/* Links Page */}
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              currentPage === "links" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <LinksPage
              socialLinks={socialLinks}
              isVisible={currentPage === "links"}
            />
          </div>

          {/* Parties Page */}
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              currentPage === "parties" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <PartiesPage
              upcomingParties={upcomingParties}
              isVisible={currentPage === "parties"}
            />
          </div>
        </div>
      </div>

      {/* Performance Overlay (Development Only) */}
      <AnimationPerformanceOverlay />
    </div>
  );
}

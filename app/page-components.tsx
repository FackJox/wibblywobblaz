"use client"

import { memo } from "react"
import { RippleButton } from "@/components/ui/ripple-button"
import { BreathingRippleButton } from "@/components/ui/breathing-ripple-button"
import { BreathingElement, BreathingLogo } from "@/components/ui/breathing-element"
import { StaggerReveal } from "@/components/ui/stagger-reveal"
import { StaggerContainer } from "@/components/ui/stagger-container"
import { Instagram, Music, ExternalLink, Calendar, MapPin, Clock, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  currentPage: "links" | "parties"
  mobileMenuOpen: boolean
  isTransitioning: boolean
  setMobileMenuOpen: (open: boolean) => void
  handlePageTransition: (page: "links" | "parties") => void
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/wibblywobblaz" },
  { name: "TikTok", icon: Music, url: "https://tiktok.com/@wibblywobblaz" },
  { name: "SoundCloud", icon: Music, url: "https://soundcloud.com/wibblywobblaz" },
  { name: "YouTube", icon: Music, url: "https://youtube.com/@wibblywobblaztv" },
]

const upcomingParties = [
  {
    id: 1,
    title: "WIBBLY WOBBLAZ - LAUNCH PARTY",
    date: "2025-08-30",
    time: "22:00",
    venue: "THE PACKHORSE SECRET CELLAR",
    location: "BRISTOL",
    poster: "/images/flyer4.png",
  },
]

export const LinksPage = memo<PageProps>(({ 
  currentPage, 
  mobileMenuOpen, 
  isTransitioning, 
  setMobileMenuOpen, 
  handlePageTransition 
}) => (
  <div className="h-screen bg-white flex flex-col overflow-hidden">
    {/* Sticky Navigation */}
    <nav className="sticky-nav border-b-4 border-black p-4 md:p-6 bg-white flex-shrink-0">
      <div className="flex justify-between items-center">
        <StaggerReveal direction="up" stagger={{ staggerChildren: 0.05 }} debugId="links-title">
          <BreathingElement variant="subtle" className="text-2xl md:text-7xl font-black tracking-tighter font-hegval">WIBBLY WOBBLAZ</BreathingElement>
        </StaggerReveal>

        {/* Desktop Navigation */}
        <StaggerContainer
          className="hidden md:flex space-x-8"
          staggerDelay={0.1}
          threshold={0.1}
          debugId="links-nav-desktop"
        >
          <RippleButton
            variant="ghost"
            className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
              currentPage === "links" ? "bg-black text-white" : ""
            }`}
            onClick={() => handlePageTransition("links")}
            disabled={isTransitioning}
          >
            LINKS
          </RippleButton>
          <RippleButton
            variant="ghost"
            className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
              currentPage === "parties" ? "bg-black text-white" : ""
            }`}
            onClick={() => handlePageTransition("parties")}
            disabled={isTransitioning}
          >
            PARTIES
          </RippleButton>
        </StaggerContainer>

        {/* Mobile Menu Button */}
        <RippleButton variant="ghost" className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </RippleButton>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 border-t-2 border-black pt-4">
          <StaggerContainer
            className="flex flex-col space-y-2"
            staggerDelay={0.08}
            threshold={0}
            debugId="links-nav-mobile"
          >
            <RippleButton
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 justify-start ${
                currentPage === "links" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </RippleButton>
            <RippleButton
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 justify-start ${
                currentPage === "parties" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </RippleButton>
          </StaggerContainer>
        </div>
      )}
    </nav>

    {/* Main Content */}
    <div className="flex-1 scrollable-content mobile-scroll-optimized">
      <div className="links-container h-full">
        {/* Responsive layout: desktop (no scroll) vs mobile (scrollable) */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side - Logo */}
          <div className="flex items-center justify-center p-4 md:p-8 bg-white md:flex-1 md:h-full">
            <StaggerReveal direction="up" stagger={{ delayChildren: 0.3 }} debugId="links-logo">
              <BreathingLogo className="max-w-lg w-full">
                <Image
                  src="/images/wibbly-wobblaz-logo.png"
                  alt="WIBBLY WOBBLAZ"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </BreathingLogo>
            </StaggerReveal>
          </div>

          {/* Right Side - Links */}
          <div className="flex-1 bg-black text-white p-4 md:p-8 flex flex-col justify-center md:h-full">
            <div className="space-y-6 md:space-y-8">
              {/* Social Links */}
              <div className="space-y-4">
                <StaggerReveal direction="left" stagger={{ delayChildren: 0.2 }} debugId="social-title">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    FOLLOW US
                  </h2>
                </StaggerReveal>
                <StaggerContainer
                  className="space-y-3"
                  staggerDelay={0.08}
                  threshold={0.1}
                  debugId="social-links"
                >
                  {socialLinks.map((social) => (
                    <BreathingRippleButton
                      key={social.name}
                      variant="ghost"
                      breathingVariant="subtle"
                      className="w-full justify-start text-left text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white text-white"
                      asChild
                    >
                      <Link
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon size={24} />
                        <span>{social.name.toUpperCase()}</span>
                        <ExternalLink size={20} className="ml-auto" />
                      </Link>
                    </BreathingRippleButton>
                  ))}
                </StaggerContainer>
              </div>

              {/* Tickets */}
              <div className="space-y-4">
                <StaggerReveal direction="left" stagger={{ delayChildren: 0.3 }} debugId="tickets-title">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    GET TICKETS
                  </h2>
                </StaggerReveal>
                <StaggerReveal direction="up" stagger={{ delayChildren: 0.35 }} debugId="tickets-button">
                  <BreathingRippleButton
                    variant="ghost"
                    breathingVariant="pulse"
                    className="w-full justify-start text-left text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white text-white"
                    asChild
                  >
                    <Link
                      href="https://hdfst.uk/e132325"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar size={24} />
                      <span>HEADFIRST</span>
                      <ExternalLink size={20} className="ml-auto" />
                    </Link>
                  </BreathingRippleButton>
                </StaggerReveal>
              </div>

              {/* Merch */}
              <div className="space-y-4 pb-10">
                <StaggerReveal direction="left" stagger={{ delayChildren: 0.4 }} debugId="merch-title">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    MERCH STORE
                  </h2>
                </StaggerReveal>
                <StaggerReveal direction="up" stagger={{ delayChildren: 0.45 }} debugId="merch-button">
                  <BreathingRippleButton
                    variant="ghost"
                    breathingVariant="pulse"
                    className="w-full justify-start text-left text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white text-white"
                    asChild
                  >
                    <Link
                      href="https://merch.wibblywobblaz.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>SHOP NOW</span>
                      <ExternalLink size={20} className="ml-auto" />
                    </Link>
                  </BreathingRippleButton>
                </StaggerReveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
))

LinksPage.displayName = 'LinksPage'

export const PartiesPage = memo<PageProps>(({ 
  currentPage, 
  mobileMenuOpen, 
  isTransitioning, 
  setMobileMenuOpen, 
  handlePageTransition 
}) => (
  <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
    {/* Navigation */}
    <nav className="border-b-4 border-white p-4 md:p-6 flex-shrink-0">
      <div className="flex justify-between items-center">
        <StaggerReveal direction="up" stagger={{ staggerChildren: 0.05 }} debugId="parties-title">
          <BreathingElement variant="subtle" className="text-2xl md:text-3xl font-black tracking-tighter text-white">UPCOMING PARTIES</BreathingElement>
        </StaggerReveal>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <RippleButton
            variant="ghost"
            className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
              currentPage === "links" ? "bg-white text-black" : ""
            }`}
            onClick={() => handlePageTransition("links")}
            disabled={isTransitioning}
          >
            LINKS
          </RippleButton>
          <RippleButton
            variant="ghost"
            className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
              currentPage === "parties" ? "bg-white text-black" : ""
            }`}
            onClick={() => handlePageTransition("parties")}
            disabled={isTransitioning}
          >
            PARTIES
          </RippleButton>
        </div>

        {/* Mobile Menu Button */}
        <RippleButton
          variant="ghost"
          className="md:hidden p-2 text-white hover:bg-white hover:text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </RippleButton>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 border-t-2 border-white pt-4">
          <StaggerContainer
            className="flex flex-col space-y-2"
            staggerDelay={0.08}
            threshold={0}
            debugId="parties-nav-mobile"
          >
            <RippleButton
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 justify-start text-white ${
                currentPage === "links" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </RippleButton>
            <RippleButton
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 justify-start text-white ${
                currentPage === "parties" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </RippleButton>
          </StaggerContainer>
        </div>
      )}
    </nav>

    {/* Main Content Area */}
    <div className="flex-1 relative overflow-y-auto">
      {/* Party content overlay */}
      <div className="relative z-10 parties-content p-4 md:p-8">
        <StaggerContainer
          className="parties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
          staggerDelay={0.12}
          threshold={0.1}
          debugId="parties-cards"
        >
          {upcomingParties.map((party) => (
            <BreathingElement
              key={party.id}
              variant="subtle"
              className="parties-card border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-300 group backdrop-blur-sm bg-opacity-90"
            >
              <div className="aspect-[3/4] border-b-4 border-white relative overflow-hidden">
                <Image
                  src={party.poster || "/images/flyer4.png"}
                  alt={party.title}
                  fill
                  className="object-cover group-hover:invert transition-all duration-200"
                />
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-lg md:text-xl font-black tracking-tighter">{party.title}</h3>

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

                  <div className="text-xs font-black tracking-wider">{party.location}</div>
                </div>

                <BreathingRippleButton
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black transition-colors duration-200"
                  breathingVariant="pulse"
                  asChild
                >
                  <Link href="https://hdfst.uk/e132325" target="_blank" rel="noopener noreferrer">
                    GET TICKETS
                  </Link>
                </BreathingRippleButton>
              </div>
            </BreathingElement>
          ))}
        </StaggerContainer>
      </div>
    </div>
  </div>
))

PartiesPage.displayName = 'PartiesPage'
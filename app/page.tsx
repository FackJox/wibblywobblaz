"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Music, ExternalLink, Calendar, MapPin, Clock, Menu, X, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PartyEvent {
  id: number
  title: string
  date: string
  time: string
  venue: string
  location: string
  poster: string
  hotOnes?: boolean
  ticketLink?: string
}

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [shhhState, setShhhState] = useState<'hidden' | 'animating' | 'visible'>('hidden')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const freeButtonRef = useRef<HTMLButtonElement>(null)

  const handlePageTransition = (targetPage: "links" | "parties") => {
    if (targetPage === currentPage) return

    setIsTransitioning(true)
    setMobileMenuOpen(false)
    setCurrentPage(targetPage)
    
    // Allow CSS transition to complete
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800)
  }


  // Reset shhh state when back on links page and transition is complete
  useEffect(() => {
    if (currentPage === "links" && !isTransitioning && shhhState !== 'hidden') {
      // Reset the shhh state so animation can run again next time
      const resetTimer = setTimeout(() => {
        setShhhState('hidden')
      }, 100) // Small delay to ensure transition is fully complete
      
      return () => clearTimeout(resetTimer)
    }
  }, [currentPage, isTransitioning, shhhState])

  // Handle FREE button click with accessibility
  const handleFreeClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    setShhhState('animating')
    // Store reference to the button that triggered the animation for focus management
    if (freeButtonRef.current) {
      freeButtonRef.current.blur() // Remove focus during animation
    }
  }

  // Handle keyboard events for FREE button
  const handleFreeKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleFreeClick(e)
    }
  }


  const upcomingParties = [
    {
      id: 1,
      title: "WIBBLY WOBBLAZ - LAUNCH PARTY",
      date: "2025-08-30",
      time: "22:00",
      venue: "THE PACKHORSE SECRET CELLAR",
      location: "BRISTOL",
      poster: "/images/1/hot series dixies chicken3.png",
      ticketLink: "https://hdfst.uk/e132325",
    },
    {
      id: 2,
      title: "HOT ONES - EP01",
      date: "2025-09-15",
      time: "19:00",
      venue: "DIXIES CHICKEN SHOP",
      location: "BRISTOL",
      poster: "/images/2/posterflyer a4.png",
      hotOnes: true,
    },
    {
      id: 3,
      title: "HOT ONES - EP02",
      date: "2025-09-22",
      time: "20:00",
      venue: "?????",
      location: "BRISTOL",
      poster: "/images/3/STGARTER.png",
      hotOnes: true,
    },
    {
      id: 4,
      title: "BARBER SHOP BOILER ROOM",
      date: "2025-10-01",
      time: "21:00",
      venue: "?????",
      location: "BRISTOL",
      poster: "/images/4/posterdayglo.png",
      hotOnes: false,
      ticketLink: "https://hdfst.uk/e132325",
    },
  ]

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/wibblywobblaz" },
    { name: "SoundCloud", icon: Music, url: "https://soundcloud.com/wibblywobblaz" },
  ]

  const LinksPage = () => (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Sticky Navigation */}
      <nav className="sticky-nav border-b-4 border-black p-4 md:p-6 bg-white flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-7xl font-black tracking-tighter font-hegval">WIBBLY WOBBLAZ</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
                currentPage === "links" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
                currentPage === "parties" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 border-t-2 border-black pt-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 justify-start ${
                  currentPage === "links" ? "bg-black text-white" : ""
                }`}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 justify-start ${
                  currentPage === "parties" ? "bg-black text-white" : ""
                }`}
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
        className="flex-1 scrollable-content mobile-scroll-optimized"
      >
        <div className="links-container h-full">
          {/* Responsive layout: desktop (no scroll) vs mobile (scrollable) */}
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Side - Logo */}
            <div className="flex items-center justify-center p-4 md:p-8 bg-white md:flex-1 md:h-full">
              <div className="max-w-lg w-full">
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
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    FOLLOW US
                  </h2>
                  <div className="space-y-3">
                    {socialLinks.map((social) => (
                      <Link
                        key={social.name}
                        href={social.url}
                        className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon size={24} />
                        <span>{social.name.toUpperCase()}</span>
                        <ExternalLink size={20} className="ml-auto" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    GET TICKETS
                  </h2>
                  <Link
                    href="https://hdfst.uk/e132325"
                    className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar size={24} />
                    <span>HEADFIRST</span>
                    <ExternalLink size={20} className="ml-auto" />
                  </Link>
                </div>

                {/* Merch */}
                <div className="space-y-4 pb-10">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                    MERCH STORE
                  </h2>
                  <Link
                    href="https://merch.wibblywobblaz.xyz"
                    className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white"
                  >
                    <ShoppingBag size={20} />
                    <span>SHOP NOW</span>
                    <ExternalLink size={20} className="ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PartiesPage = () => (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="border-b-4 border-white p-4 md:p-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-white">UPCOMING PARTIES</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
                currentPage === "links" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("links")}
              disabled={isTransitioning}
            >
              LINKS
            </Button>
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
                currentPage === "parties" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("parties")}
              disabled={isTransitioning}
            >
              PARTIES
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden p-2 text-white hover:bg-white hover:text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 border-t-2 border-white pt-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 justify-start text-white ${
                  currentPage === "links" ? "bg-white text-black" : ""
                }`}
                onClick={() => handlePageTransition("links")}
                disabled={isTransitioning}
              >
                LINKS
              </Button>
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 justify-start text-white ${
                  currentPage === "parties" ? "bg-white text-black" : ""
                }`}
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
      <div className="flex-1 relative overflow-y-auto">
        {/* Accessibility live region for animation announcements */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {shhhState === 'animating' && "Animation started, opening Instagram..."}
          {shhhState === 'visible' && "Animation completed, Instagram opening in new tab"}
        </div>

        {/* Shhh SVG - stays visible after first animation */}
        <div
          role="img"
          aria-label="Shhh character animation"
          aria-hidden={shhhState === 'hidden'}
          className={`absolute inset-0 flex items-end justify-center will-change-transform gpu-accelerated z-50 ${
            shhhState === 'animating' ? 'shhh-slide-up' : ''
          }`}
          style={{
            transform: (shhhState === 'animating' || shhhState === 'visible') ? 'translateY(0)' : 'translateY(100vh)',
            transition: shhhState === 'animating' ? 'none' : 'transform 0ms',
            opacity: (shhhState === 'animating' || shhhState === 'visible') ? 1 : 0,
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === 'slideUpBounce') {
              setShhhState('visible');
              setCurrentPage('links');
              window.open('https://instagram.com/wibblywobblaz', '_blank');
            }
          }}
        >
          <div className="bottom-aligned-responsive gpu-accelerated">
            <Image
              src="/images/shhh.svg"
              alt="Shhh"
              width={1024}
              height={1024}
              className="w-auto h-auto object-contain"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                display: 'block',
              }}
              priority
            />
          </div>
        </div>

        {/* Party content overlay */}
             {/* Poster */}
                 {/* Event Details */}
         <div className="relative z-10 parties-content p-4 md:p-8">
          <div className="parties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {upcomingParties.map((party, index) => (
              <div
                key={party.id}
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

                  {party.hotOnes ? (
                    <Button
                      ref={freeButtonRef}
                      onClick={handleFreeClick}
                      onKeyDown={handleFreeKeyDown}
                      aria-label="Free ticket - opens Instagram"
                      aria-pressed={shhhState === 'animating'}
                      disabled={shhhState === 'animating'}
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {shhhState === 'animating' ? 'LOADING...' : 'FREE'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black transition-colors duration-200"
                      asChild
                    >
                      <Link href={party.ticketLink || "https://hdfst.uk/e132325"} target="_blank" rel="noopener noreferrer">
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
  )

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Pages Container */}
      <div
        className={`flex w-[200%] h-full transition-transform duration-700 ease-in-out ${
          currentPage === "parties" ? "-translate-x-1/2" : "translate-x-0"
        }`}
      >
        {/* Links Page */}
        <div className="w-1/2 h-full">
          <LinksPage />
        </div>
        
        {/* Parties Page */}
        <div className="w-1/2 h-full">
          <PartiesPage />
        </div>
      </div>
    </div>
  )
}

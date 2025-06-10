"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Music, ExternalLink, Calendar, MapPin, Clock, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [shhhState, setShhhState] = useState<'hidden' | 'animating' | 'visible'>('hidden')
  const [logoScaled, setLogoScaled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  // Handle parties page animation and bounce-back
  useEffect(() => {
    if (currentPage === "parties" && shhhState === 'hidden' && !isTransitioning) {
      // Start animation after page transition completes
      const startAnimationTimer = setTimeout(() => {
        setShhhState('animating')
        
        // After animation completes, bounce back to links
        const bounceBackTimer = setTimeout(() => {
          setShhhState('visible') // Keep visible but stop animating
          
          // Direct page transition back to links
          setIsTransitioning(true)
          setMobileMenuOpen(false)
          setCurrentPage("links")
          
          setTimeout(() => {
            setIsTransitioning(false)
          }, 800)
        }, 1000) // 900ms animation + small buffer
        
        return () => clearTimeout(bounceBackTimer)
      }, 200)
      
      return () => clearTimeout(startAnimationTimer)
    }
  }, [currentPage, shhhState, isTransitioning])

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

  // Handle scroll events for logo scaling on Links page
  useEffect(() => {
    const handleScroll = () => {
      if (currentPage !== "links" || !scrollContainerRef.current) return
      
      const scrollTop = scrollContainerRef.current.scrollTop
      const threshold = window.innerHeight * 0.1 // Trigger scaling after scrolling 10% of viewport height
      
      if (scrollTop > threshold && !logoScaled) {
        setLogoScaled(true)
      } else if (scrollTop <= threshold && logoScaled) {
        setLogoScaled(false)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer && currentPage === "links") {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentPage, logoScaled])

  // Reset logo scaling when switching pages
  useEffect(() => {
    if (currentPage !== "links") {
      setLogoScaled(false)
    }
  }, [currentPage])

  const upcomingParties = [
    {
      id: 1,
      title: "WIBBLY WOBBLAZ",
      date: "2025-08-30",
      time: "22:00",
      venue: "THE PACKHORSE",
      location: "BRISTOL",
      poster: "/placeholder.svg?height=400&width=300",
    },
  ]

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/wibblywobblaz" },
    { name: "TikTok", icon: Music, url: "https://tiktok.com/@wibblywobblaz" },
    { name: "SoundCloud", icon: Music, url: "https://soundcloud.com/wibblywobblaz" },
    { name: "YouTube", icon: Music, url: "https://youtube.com/@wibblywobblaztv" },
  ]

  const LinksPage = () => (
    <div className="h-full bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b-4 border-black p-4 md:p-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter">WIBBLY WOBBLAZ</div>

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
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Left Side - Logo */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white relative z-10">
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
        <div className="flex-1 bg-black text-white p-4 md:p-8 flex flex-col justify-center">
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
                href="https://www.headfirstbristol.co.uk/"
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
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter border-b-2 border-white pb-2">
                MERCH STORE
              </h2>
              <Link
                href="https://merch.wibblywobblaz.xyz"
                className="flex items-center space-x-3 text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-colors duration-200 p-3 border-2 border-white"
              >
                <span>SHOP NOW</span>
                <ExternalLink size={20} className="ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PartiesPage = () => (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b-4 border-white p-4 md:p-6">
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
      <div className="flex-1 relative overflow-hidden">
        {/* Shhh SVG - stays visible after first animation */}
        <div
          className={`absolute inset-0 flex items-end justify-center will-change-transform gpu-accelerated ${
            shhhState === 'animating' ? 'shhh-slide-up' : ''
          }`}
          style={{
            transform: (shhhState === 'animating' || shhhState === 'visible') ? 'translateY(0)' : 'translateY(100vh)',
            transition: shhhState === 'animating' ? 'none' : 'transform 0ms',
            opacity: (shhhState === 'animating' || shhhState === 'visible') ? 1 : 0,
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
        {/* <div className="relative z-10 p-4 md:p-8 h-full flex flex-col justify-start">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {upcomingParties.map((party, index) => (
              <div
                key={party.id}
                className="border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-300 group backdrop-blur-sm bg-opacity-90"
              >
           
                <div className="aspect-[3/4] border-b-4 border-white relative overflow-hidden">
                  <Image
                    src={party.poster || "/placeholder.svg"}
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

                  <Button
                    className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black transition-colors duration-200"
                    asChild
                  >
                    <Link href="https://www.headfirstbristol.co.uk/" target="_blank" rel="noopener noreferrer">
                      GET TICKETS
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}


      </div>
    </div>
  )

  return (
    <div className="relative overflow-hidden h-screen">
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

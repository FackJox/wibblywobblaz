"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Music, ExternalLink, Calendar, MapPin, Clock, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"home" | "shows">("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handlePageTransition = (targetPage: "home" | "shows") => {
    if (targetPage === currentPage) return

    setIsTransitioning(true)
    setMobileMenuOpen(false)
    setTimeout(() => {
      setCurrentPage(targetPage)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 500)
  }

  const upcomingShows = [
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

  const HomePage = () => (
    <div className="h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b-4 border-black p-4 md:p-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter">WIBBLY WOBBLAZ</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
                currentPage === "home" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("home")}
              disabled={isTransitioning}
            >
              HOME
            </Button>
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 ${
                currentPage === "shows" ? "bg-black text-white" : ""
              }`}
              onClick={() => handlePageTransition("shows")}
              disabled={isTransitioning}
            >
              SHOWS
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
                  currentPage === "home" ? "bg-black text-white" : ""
                }`}
                onClick={() => handlePageTransition("home")}
                disabled={isTransitioning}
              >
                HOME
              </Button>
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-black hover:text-white transition-colors duration-200 justify-start ${
                  currentPage === "shows" ? "bg-black text-white" : ""
                }`}
                onClick={() => handlePageTransition("shows")}
                disabled={isTransitioning}
              >
                SHOWS
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
        <div
          className={`flex-1 bg-black text-white p-4 md:p-8 flex flex-col justify-center transition-all duration-500 ease-in-out ${
            isTransitioning ? "transform scale-x-[200%] scale-y-[200%] origin-left" : ""
          }`}
        >
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
                href="https://headfirst.co.uk"
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
                href="merch.wibblywobblaz.xyz"
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

  const ShowsPage = () => (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b-4 border-white p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-white">UPCOMING SHOWS</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
                currentPage === "home" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("home")}
              disabled={isTransitioning}
            >
              HOME
            </Button>
            <Button
              variant="ghost"
              className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 text-white border-white ${
                currentPage === "shows" ? "bg-white text-black" : ""
              }`}
              onClick={() => handlePageTransition("shows")}
              disabled={isTransitioning}
            >
              SHOWS
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
                  currentPage === "home" ? "bg-white text-black" : ""
                }`}
                onClick={() => handlePageTransition("home")}
                disabled={isTransitioning}
              >
                HOME
              </Button>
              <Button
                variant="ghost"
                className={`text-xl font-black hover:bg-white hover:text-black transition-colors duration-200 justify-start text-white ${
                  currentPage === "shows" ? "bg-white text-black" : ""
                }`}
                onClick={() => handlePageTransition("shows")}
                disabled={isTransitioning}
              >
                SHOWS
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Shows Grid */}
      <div className="flex-1 p-4 md:p-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 h-full">
          {upcomingShows.map((show, index) => (
            <div
              key={show.id}
              className={`border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-300 group transform ${
                isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
              }`}
              style={{
                transitionDelay: isTransitioning ? "0ms" : `${index * 100}ms`,
              }}
            >
              {/* Poster */}
              <div className="aspect-[3/4] border-b-4 border-white relative overflow-hidden">
                <Image
                  src={show.poster || "/placeholder.svg"}
                  alt={show.title}
                  fill
                  className="object-cover group-hover:invert transition-all duration-200"
                />
              </div>

              {/* Event Details */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg md:text-xl font-black tracking-tighter">{show.title}</h3>

                <div className="space-y-2 text-sm md:text-base font-bold">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(show.date)
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
                    <span>{show.time}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{show.venue}</span>
                  </div>

                  <div className="text-xs font-black tracking-wider">{show.location}</div>
                </div>

                <Button
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black group-hover:bg-black group-hover:text-white group-hover:border-black font-black transition-colors duration-200"
                  asChild
                >
                  <Link href="https://headfirst.co.uk" target="_blank" rel="noopener noreferrer">
                    GET TICKETS
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative overflow-hidden">
      {/* Transition Overlay */}
      {isTransitioning && <div className="fixed inset-0 bg-black z-50 transition-opacity duration-500" />}

      {/* Page Content */}
      <div className={`transition-all duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {currentPage === "home" ? <HomePage /> : <ShowsPage />}
      </div>
    </div>
  )
}

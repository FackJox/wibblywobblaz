"use client"

import { useState, useEffect, useRef } from "react"
import { LinksPage, PartiesPage } from "./page-components"

export default function WibblyWobblazLanding() {
  const [currentPage, setCurrentPage] = useState<"links" | "parties">("links")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [shhhState, setShhhState] = useState<'hidden' | 'animating' | 'visible'>('hidden')
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

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Pages Container - Both pages always mounted */}
      <div className="relative w-full h-full page-container">
        {/* Links Page - Always mounted, positioned absolutely */}
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out page-transition ${
            currentPage === "links" 
              ? "translate-x-0" 
              : "-translate-x-full"
          }`}
          style={{
            pointerEvents: currentPage === "links" ? "auto" : "none",
            visibility: currentPage === "links" || isTransitioning ? "visible" : "hidden"
          }}
        >
          <LinksPage
            currentPage={currentPage}
            mobileMenuOpen={mobileMenuOpen}
            isTransitioning={isTransitioning}
            setMobileMenuOpen={setMobileMenuOpen}
            handlePageTransition={handlePageTransition}
          />
        </div>
        
        {/* Parties Page - Always mounted, positioned absolutely */}
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out page-transition ${
            currentPage === "parties" 
              ? "translate-x-0" 
              : "translate-x-full"
          }`}
          style={{
            pointerEvents: currentPage === "parties" ? "auto" : "none",
            visibility: currentPage === "parties" || isTransitioning ? "visible" : "hidden"
          }}
        >
          <PartiesPage
            currentPage={currentPage}
            mobileMenuOpen={mobileMenuOpen}
            isTransitioning={isTransitioning}
            setMobileMenuOpen={setMobileMenuOpen}
            handlePageTransition={handlePageTransition}
          />
        </div>
      </div>
    </div>
  )
}
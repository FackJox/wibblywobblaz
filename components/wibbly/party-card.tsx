"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { css } from "@/styled-system/css";
import { PartyEvent } from "@/types";
import { calculateParallaxTransform, type MousePosition } from "@/hooks/use-shared-mouse";

interface PartyCardProps {
  party: PartyEvent;
  index: number;
  mousePosition?: MousePosition;
  onFreeClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onFreeKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  shhhState: "hidden" | "animating" | "visible";
  freeButtonRef?: React.RefObject<HTMLButtonElement | null>;
  staggerAnimation?: {
    opacity?: number;
    transform?: string;
    transition?: string;
  };
}

export function PartyCard({
  party,
  index,
  mousePosition,
  onFreeClick,
  onFreeKeyDown,
  shhhState,
  freeButtonRef,
  staggerAnimation,
}: PartyCardProps) {
  // Card ref for parallax calculations
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Track when magnetic hover is active to disable parallax
  const [isMagneticActive, setIsMagneticActive] = React.useState(false);
  
  // Calculate parallax transform using shared mouse position
  const intensity = 0.02 + index * 0.005;
  const maxOffset = 20 + index * 3;
  const parallaxTransform = React.useMemo(() => {
    // Don't apply parallax when magnetic effect is active
    if (!mousePosition || isMagneticActive) return 'translate3d(0, 0, 0)';
    return calculateParallaxTransform(cardRef.current, mousePosition, intensity, maxOffset);
  }, [mousePosition, intensity, maxOffset, isMagneticActive]);

  // Combine parallax and stagger transforms
  const staggerTransform = staggerAnimation?.transform || '';
  const combinedTransform = staggerTransform ? 
    `${parallaxTransform} ${staggerTransform}` : 
    parallaxTransform;

  return (
    <div
      ref={cardRef}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        border: '4px solid white',
        backgroundColor: 'black',
        color: 'white',
        transition: 'all 0.3s',
        backdropFilter: 'blur(0.125rem)',
        contain: 'layout style',
        _hover: {
          backgroundColor: 'white',
          color: 'black'
        }
      })}
      style={{
        opacity: staggerAnimation?.opacity ?? 0,
        transform: combinedTransform,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {/* Poster */}
      <div className={css({
        aspectRatio: '3/4',
        borderBottom: '4px solid white',
        position: 'relative',
        overflow: 'hidden'
      })}>
        <Image
          src={party.poster || "/images/flyer4.png"}
          alt={party.title}
          fill
          className={css({
            objectFit: 'cover',
            transition: 'all 0.2s',
            '.group:hover &': {
              filter: 'invert(1)'
            }
          })}
        />
      </div>

      {/* Event Details */}
      <div className={css({
        padding: '4',
        '& > * + *': {
          marginTop: '3'
        }
      })}>
        <h3 className={css({
          fontSize: { base: 'lg', md: 'xl' },
          fontWeight: 'black',
          letterSpacing: 'tighter'
        })}>
          {party.title}
        </h3>

        <div className={css({
          '& > * + *': {
            marginTop: '2'
          },
          fontSize: { base: 'sm', md: 'base' },
          fontWeight: 'bold'
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
            fontWeight: 'black',
            letterSpacing: 'wider'
          })}>
            {party.location}
          </div>
        </div>

        {party.hotOnes ? (
          <Button
            ref={index === 0 ? freeButtonRef : undefined}
            onMouseEnter={() => setIsMagneticActive(true)}
            onMouseLeave={() => setIsMagneticActive(false)}
            onClick={onFreeClick}
            onKeyDown={onFreeKeyDown}
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
            ripple={true}
            clickAnimation={true}
            magnetic={true}
          >
            {shhhState === "animating" ? "LOADING..." : "FREE"}
          </Button>
        ) : (
          <Button
            onMouseEnter={() => setIsMagneticActive(true)}
            onMouseLeave={() => setIsMagneticActive(false)}
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
            onClick={() => window.open(party.ticketLink || 'https://hdfst.uk/e132325', '_blank')}
            ripple={true}
            clickAnimation={true}
            magnetic={true}
          >
            GET TICKETS
          </Button>
        )}
      </div>
    </div>
  );
}
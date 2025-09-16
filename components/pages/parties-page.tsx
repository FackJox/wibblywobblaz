"use client";

import React from "react";
import { useStaggerReveal } from "@/hooks/use-stagger-reveal";
import { PartyCard } from "@/components/wibbly/party-card";
import { css } from "@/styled-system/css";
import { PartyEvent } from "@/types";
import { type MousePosition } from "@/hooks/use-shared-mouse";

interface PartiesPageProps {
  upcomingParties: Array<PartyEvent>;
  isVisible: boolean;
  mousePosition?: MousePosition;
  handleFreeClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  handleFreeKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  shhhState: "hidden" | "animating" | "visible";
  freeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export const PartiesPage: React.FC<PartiesPageProps> = ({
  upcomingParties,
  isVisible,
  mousePosition,
  handleFreeClick,
  handleFreeKeyDown,
  shhhState,
  freeButtonRef,
}) => {
  // Scroll animations for parties page
  const partiesStagger = useStaggerReveal<HTMLDivElement>(upcomingParties.length, {
    staggerDelay: 200,
    duration: 700,
    threshold: 0.1,
    once: false,
  });

  // Store animation functions in refs to avoid dependency issues
  const partiesTriggerRef = React.useRef(partiesStagger.trigger);
  const partiesResetRef = React.useRef(partiesStagger.reset);
  
  React.useEffect(() => {
    partiesTriggerRef.current = partiesStagger.trigger;
    partiesResetRef.current = partiesStagger.reset;
  }, [partiesStagger.trigger, partiesStagger.reset]);

  // Reset animations when page becomes hidden
  React.useEffect(() => {
    console.log('[RND-PAGE] PartiesPage visibility changed:', isVisible);
    if (!isVisible) {
      // Reset animations when page is hidden
      partiesResetRef.current();
    } else {
      // Trigger animations when page becomes visible
      setTimeout(() => {
        partiesTriggerRef.current();
      }, 100);
    }
  }, [isVisible]);

  return (
    <div className={css({
      height: 'full',
      backgroundColor: 'black',
      color: 'white',
      overflowY: 'auto'
    })}>
      <div className={css({
        padding: { base: '4', md: '8' }
      })}>
        <div
          ref={partiesStagger.containerRef}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { base: '4', md: '6' },
            maxWidth: '7xl',
            marginX: 'auto'
          })}
        >
          {upcomingParties.map((party: PartyEvent, index: number) => (
            <PartyCard
              key={party.id}
              party={party}
              index={index}
              mousePosition={mousePosition}
              onFreeClick={handleFreeClick}
              onFreeKeyDown={handleFreeKeyDown}
              shhhState={shhhState}
              freeButtonRef={index === 0 ? freeButtonRef : undefined}
              staggerAnimation={{
                opacity: partiesStagger.items[index]?.opacity,
                transform: partiesStagger.items[index]?.transform,
                transition: partiesStagger.items[index]?.transition,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
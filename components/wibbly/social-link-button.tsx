"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { GestureWrapper } from "@/components/ui/gesture-wrapper";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";
import { toast } from "@/components/ui/use-toast";
import { css } from "@/styled-system/css";
import { SocialLink } from "@/types";

export interface SocialLinkButtonProps {
  social: SocialLink;
  style?: React.CSSProperties;
}

export const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
  social,
  style,
}) => {
  // Magnetic hover effect
  const magneticEffect = useMagneticHover<HTMLButtonElement>({ 
    strength: 0.2, 
    maxDistance: 80 
  });

  return (
    <GestureWrapper
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
      style={style}
    >
      <Button
        ref={magneticEffect.ref}
        className={css({
          width: 'full',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '3',
          fontSize: { base: 'lg', md: 'xl' },
          fontWeight: 'bold',
          padding: '3',
          border: '2px solid white',
          backgroundColor: 'transparent',
          color: 'white',
          transition: 'all 0.2s',
          _hover: {
            backgroundColor: 'white',
            color: 'black'
          }
        })}
        onClick={() => window.open(social.url, '_blank')}
        ripple={true}
        magnetic={true}
        clickAnimation={true}
      >
        <social.icon size={24} />
        <span>{social.name.toUpperCase()}</span>
        <ExternalLink size={20} className={css({ marginLeft: 'auto' })} />
      </Button>
    </GestureWrapper>
  );
};
import React from "react";

export interface PartyEvent {
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

export interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size: number }>;
  url: string;
}
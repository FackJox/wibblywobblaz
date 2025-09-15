import { Instagram, Music } from "lucide-react";
import { PartyEvent, SocialLink } from "@/types";

export const upcomingParties: PartyEvent[] = [
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

export const socialLinks: SocialLink[] = [
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
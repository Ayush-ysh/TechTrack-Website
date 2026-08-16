export type EventStatus = "ongoing" | "upcoming" | "past";
export type EventCategory = "Hackathon" | "Ideathon" | "Workshop" | "Competition" | "Meetup";

export interface EventData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  time: string;
  venue: string;
  poster: string;
  registrationUrl?: string;
  registrationDeadline?: string;
  teamSize?: string;
  rules?: string[];
  rounds?: { name: string; description: string }[];
  prizes?: string;
  coordinators?: { name: string; contact: string }[];
  year?: string;
  participantsCount?: string;
  highlight?: string;
}

export const events: EventData[] = [
  {
    id: "1",
    slug: "semicolon-ideathon",
    name: "SEMI COLON ;",
    tagline: "“Where others put a full stop, we choose to continue.”",
    description: "A 24-hour ideathon focused on solving real-world challenges through creative technology solutions. Pitch your ideas to industry leaders and turn concepts into reality.",
    category: "Ideathon",
    status: "upcoming",
    date: "OCTOBER 15, 2026",
    time: "10:00 AM - 10:00 AM (Next Day)",
    venue: "MAIN AUDITORIUM",
    poster: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    registrationUrl: "#",
    registrationDeadline: "OCTOBER 10, 2026",
    teamSize: "2 - 4 Members",
    rules: [
      "Ideas must be original and not previously submitted to other competitions.",
      "Teams must be present on campus for the entire duration.",
      "Use of open-source frameworks is allowed and encouraged."
    ],
    rounds: [
      { name: "Round 01", description: "Initial Idea Pitch (3 minutes)" },
      { name: "Round 02", description: "Prototype Development and Mentoring" },
      { name: "Final Presentation", description: "Final Demo (5 minutes + Q&A)" }
    ],
    prizes: "1st Prize: ₹50,000 | 2nd Prize: ₹25,000 | 3rd Prize: ₹10,000",
    coordinators: [
      { name: "Alice Johnson", contact: "+91 98765 43210" },
      { name: "Bob Smith", contact: "+91 98765 43211" }
    ]
  },
  {
    id: "2",
    slug: "build-the-web",
    name: "BUILD THE WEB",
    tagline: "Master modern web development.",
    description: "An intensive weekend bootcamp covering Next.js, Tailwind CSS, and Framer Motion. Learn to build production-ready applications.",
    category: "Workshop",
    status: "ongoing",
    date: "AUGUST 15 - 16, 2026",
    time: "09:00 AM - 05:00 PM",
    venue: "LAB 402",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    registrationUrl: "#"
  },
  {
    id: "3",
    slug: "hack-the-future-2025",
    name: "HACK THE FUTURE",
    tagline: "Build solutions for tomorrow.",
    description: "Our flagship annual hackathon that saw over 500 participants building solutions in Web3, AI, and Sustainable Tech.",
    category: "Hackathon",
    status: "past",
    date: "FEBRUARY 20, 2025",
    time: "48 Hours",
    venue: "CAMPUS",
    poster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    year: "2025",
    participantsCount: "500+",
    highlight: "120+ Projects Submitted"
  },
  {
    id: "4",
    slug: "design-systems-workshop",
    name: "DESIGN SYSTEMS",
    tagline: "Bridging the gap between design and code.",
    description: "A hands-on workshop on creating scalable design systems using Figma and React.",
    category: "Workshop",
    status: "past",
    date: "NOVEMBER 10, 2025",
    time: "10:00 AM - 02:00 PM",
    venue: "DESIGN STUDIO",
    poster: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    year: "2025",
    participantsCount: "150+",
    highlight: "Highest rated workshop of the year"
  },
  {
    id: "5",
    slug: "code-clash",
    name: "CODE CLASH",
    tagline: "Competitive programming at its finest.",
    description: "An algorithmic programming contest with tough problems and a fierce leaderboard.",
    category: "Competition",
    status: "past",
    date: "SEPTEMBER 05, 2025",
    time: "02:00 PM - 05:00 PM",
    venue: "COMPUTER CENTER",
    poster: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    year: "2025",
    participantsCount: "300+",
    highlight: "Won by Team 'Syntax Error'"
  }
];

export const achievements = [
  { year: "2024", title: "TechTrack Established", description: "The vision began with 10 students." },
  { year: "2025", title: "Conducted 20+ events", description: "Expanded across multiple technical domains." },
  { year: "2025", title: "1000+ student participation", description: "Became the largest club on campus." },
  { year: "2026", title: "Won National Hackathon", description: "Our tech team secured 1st place globally." },
  { year: "2026", title: "Hosted 'SEMI COLON ;'", description: "Organized our first ever mega-ideathon." }
];

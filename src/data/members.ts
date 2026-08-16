export type Division = "leadership" | "design" | "tech" | "multimedia" | "social-media" | "management";

export interface Member {
  id: string;
  name: string;
  role: string;
  division: Division;
  image: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export const members: Member[] = [
  // LEADERSHIP
  {
    id: "lead-1",
    name: "PRATYUSH RANJAN BEHERA",
    role: "LEAD — TECHTRACK",
    division: "leadership",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#",
    github: "#"
  },
  {
    id: "lead-2",
    name: "ASHUTOSH PRUSTI",
    role: "CO-LEAD — TECHTRACK",
    division: "leadership",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#",
    github: "#"
  },
  
  // DESIGN
  {
    id: "des-1",
    name: "Elena Rodriguez",
    role: "UI/UX Designer",
    division: "design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#"
  },
  {
    id: "des-2",
    name: "Michael Chen",
    role: "Graphic Designer",
    division: "design",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#"
  },
  {
    id: "des-3",
    name: "Sarah Kim",
    role: "Creative Designer",
    division: "design",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#"
  },

  // TECH
  {
    id: "tech-1",
    name: "David Smith",
    role: "Frontend Developer",
    division: "tech",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    github: "#"
  },
  {
    id: "tech-2",
    name: "Aisha Patel",
    role: "Backend Developer",
    division: "tech",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    github: "#"
  },
  {
    id: "tech-3",
    name: "James Wilson",
    role: "App Developer",
    division: "tech",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    github: "#"
  },
  {
    id: "tech-4",
    name: "Priya Sharma",
    role: "Technical Coordinator",
    division: "tech",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    github: "#"
  },

  // MULTIMEDIA
  {
    id: "multi-1",
    name: "Chris Evans",
    role: "Photographer",
    division: "multimedia",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop",
    instagram: "#"
  },
  {
    id: "multi-2",
    name: "Emma Davis",
    role: "Videographer",
    division: "multimedia",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    instagram: "#"
  },
  {
    id: "multi-3",
    name: "Tom Harris",
    role: "Video Editor",
    division: "multimedia",
    image: "https://images.unsplash.com/photo-1552058544-e2bfd430fc48?q=80&w=1000&auto=format&fit=crop",
    instagram: "#"
  },

  // SOCIAL MEDIA
  {
    id: "sm-1",
    name: "Lisa Wong",
    role: "Social Media Manager",
    division: "social-media",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#",
    instagram: "#"
  },
  {
    id: "sm-2",
    name: "Marcus Johnson",
    role: "Content Strategist",
    division: "social-media",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#"
  },

  // MANAGEMENT
  {
    id: "mgt-1",
    name: "Rachel Green",
    role: "Event Coordinator",
    division: "management",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#"
  },
  {
    id: "mgt-2",
    name: "Omar Farooq",
    role: "Operations",
    division: "management",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#"
  },
  {
    id: "mgt-3",
    name: "Sophia Martinez",
    role: "Logistics",
    division: "management",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    linkedin: "#"
  }
];

import { GraduationCap, Banknote, Trophy, Film, Scale } from "lucide-react";
import type { Addon } from "./types";

export const addons: Addon[] = [
  {
    id: "edtech",
    name: "Education Hub",
    description:
      "Comprehensive platform for online learning management, course creation, and student engagement tracking with advanced analytics.",
    shortDescription: "Online courses and learning tools",
    icon: GraduationCap,
    installed: false,
    category: "edtech",
    version: "1.2.0",
    size: "24MB",
    features: [
      "Course Builder",
      "Student Analytics",
      "Quiz Generator",
      "Assignment Management",
    ],
    author: "EduTech Labs",
    rating: 4.7,
  },
  {
    id: "fintech",
    name: "Finance Portal",
    description:
      "Complete financial management suite with banking integrations, investment tracking, and automated reporting for personal and business finance.",
    shortDescription: "Banking and investment tools",
    icon: Banknote,
    installed: false,
    category: "fintech",
    version: "2.1.5",
    size: "32MB",
    features: [
      "Transaction Analysis",
      "Investment Tracking",
      "Budget Planning",
      "Tax Preparation",
    ],
    author: "FinancePro Inc.",
    rating: 4.5,
  },
  {
    id: "esports",
    name: "Gaming Arena",
    description:
      "Esports tournament management and live streaming platform with player statistics, team management, and audience engagement tools.",
    shortDescription: "Esports tournaments and streaming",
    icon: Trophy,
    installed: false,
    category: "esports",
    version: "1.0.8",
    size: "45MB",
    features: [
      "Tournament Brackets",
      "Live Streaming",
      "Team Management",
      "Statistics Tracking",
    ],
    author: "GameTech Solutions",
    rating: 4.2,
  },
  {
    id: "media",
    name: "Media Studio",
    description:
      "Professional-grade media creation and editing suite with multi-platform publishing integration and audience analytics dashboard.",
    shortDescription: "Content creation and streaming",
    icon: Film,
    installed: true,
    category: "media",
    version: "3.4.2",
    size: "78MB",
    features: [
      "Video Editing",
      "Audio Mixing",
      "Graphics Creation",
      "Media Library",
    ],
    author: "CreativeTech",
    rating: 4.9,
  },
  {
    id: "legal",
    name: "Legal Assistant",
    description:
      "Comprehensive legal document preparation and management system with contract templates, e-signature capabilities, and compliance checking.",
    shortDescription: "Legal documents and consultation",
    icon: Scale,
    installed: false,
    category: "legal",
    version: "2.0.1",
    size: "18MB",
    features: [
      "Document Templates",
      "E-Signature",
      "Compliance Check",
      "Case Management",
    ],
    author: "LegalTech Solutions",
    rating: 4.3,
  },
];

export const categories = [
  { id: "edtech", name: "Education" },
  { id: "fintech", name: "Finance" },
  { id: "esports", name: "Gaming" },
  { id: "media", name: "Media" },
  { id: "legal", name: "Legal" },
];

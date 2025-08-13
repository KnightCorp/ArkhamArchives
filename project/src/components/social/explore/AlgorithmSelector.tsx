import React from "react";
import {
  Brain,
  Clock,
  Heart,
  Users,
  Compass,
  Moon,
  HourglassIcon,
  Shuffle,
  History,
  Route,
  MapPin,
  GraduationCap,
  Palette,
} from "lucide-react";
import type { AlgorithmType } from "../types/explore";

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
}

const algorithms = [
  {
    id: "chronological" as const,
    name: "Chronological",
    description: "Content shown in order of creation",
    icon: Clock,
  },
  {
    id: "engagement" as const,
    name: "Engagement-Based",
    description: "Content ranked by user interaction",
    icon: Heart,
  },
  {
    id: "interest" as const,
    name: "Interest-Based",
    description: "Personalized based on your interests",
    icon: Brain,
  },
  {
    id: "network" as const,
    name: "Network-Based",
    description: "Content from your connections",
    icon: Users,
  },
  {
    id: "discovery" as const,
    name: "Discovery",
    description: "Explore new and diverse content",
    icon: Compass,
  },
  {
    id: "mood" as const,
    name: "Mood-Based",
    description: "Content matching your current mood",
    icon: Moon,
  },
  {
    id: "timeInvestment" as const,
    name: "Time Investment",
    description: "Optimized for your available time",
    icon: HourglassIcon,
  },
  {
    id: "contrarian" as const,
    name: "Contrarian",
    description: "Challenge your perspective",
    icon: Shuffle,
  },
  {
    id: "timeCapsule" as const,
    name: "Time Capsule",
    description: "Rediscover past content",
    icon: History,
  },
  {
    id: "creatorJourney" as const,
    name: "Creator Journey",
    description: "Follow creator progressions",
    icon: Route,
  },
  {
    id: "localProximity" as const,
    name: "Local Proximity",
    description: "Content from your area",
    icon: MapPin,
  },
  {
    id: "expertiseDevelopment" as const,
    name: "Expertise Development",
    description: "Build skills progressively",
    icon: GraduationCap,
  },
  {
    id: "creativeRemix" as const,
    name: "Creative Remix",
    description: "Inspired by creative combinations",
    icon: Palette,
  },
];

export const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
}: AlgorithmSelectorProps) => {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 mb-8">
      <h2 className="text-xl text-zinc-200 mb-6 font-cormorant">
        Content Algorithm
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {algorithms.map((algorithm) => {
          const Icon = algorithm.icon;
          return (
            <button
              key={algorithm.id}
              onClick={() => onAlgorithmChange(algorithm.id)}
              className={`flex items-start space-x-3 p-4 rounded-lg transition-all ${
                selectedAlgorithm === algorithm.id
                  ? "bg-zinc-800 border border-zinc-700"
                  : "bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-1 ${
                  selectedAlgorithm === algorithm.id
                    ? "text-purple-400"
                    : "text-zinc-400"
                }`}
              />
              <div className="text-left">
                <div
                  className={`font-medium ${
                    selectedAlgorithm === algorithm.id
                      ? "text-purple-400"
                      : "text-zinc-200"
                  }`}
                >
                  {algorithm.name}
                </div>
                <div className="text-sm text-zinc-400">
                  {algorithm.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { AlgorithmSelector } from "../components/explore/AlgorithmSelector";
import { PeopleSection } from "../components/explore/sections/PeopleSection";
import { CreatorsSection } from "../components/explore/sections/CreatorsSection";
import { StyleSection } from "../components/explore/sections/StyleSection";
import { InterestsSection } from "../components/explore/sections/InterestsSection";
import { EventsSection } from "../components/explore/sections/EventsSection";
import { LocationsSection } from "../components/explore/sections/LocationsSection";
import { MapsSection } from "../components/explore/sections/MapsSection";
import {
  Brain,
  Users,
  Star,
  Palette,
  Compass,
  Calendar,
  MapPin,
  Map,
  Search,
} from "lucide-react";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("people");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "people", label: "People", icon: Users },
    // { id: "creators", label: "Creators", icon: Star },
    { id: "style", label: "Style & Vibes", icon: Palette },
    { id: "interests", label: "Interests", icon: Compass },
    { id: "events", label: "Events", icon: Calendar },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "maps", label: "Maps", icon: Map },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "people":
        return <PeopleSection />;
      case "creators":
        return <CreatorsSection />;
      case "style":
        return <StyleSection />;
      case "interests":
        return <InterestsSection />;
      case "events":
        return <EventsSection />;
      case "locations":
        return <LocationsSection />;
      case "maps":
        return <MapsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Brain className="w-8 h-8 text-zinc-400" />
        <h1 className="text-3xl text-zinc-200">Explore</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search everything..."
          className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500"
        />
      </div>

      <AlgorithmSelector
        selectedAlgorithm="chronological"
        onAlgorithmChange={() => {}}
      />

      <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900/50 backdrop-blur-sm p-2 rounded-lg border border-zinc-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === id
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default Explore;

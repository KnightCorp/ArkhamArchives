import React, { useState } from 'react';
import { ExploreNav } from '../components/explore/ExploreNav';
import { useExplorePreferences } from '../hooks/useExplorePreferences';
import { PeopleSection } from '../components/explore/sections/PeopleSection';
import { CreatorsSection } from '../components/explore/sections/CreatorsSection';
import { StyleSection } from '../components/explore/sections/StyleSection';
import { InterestsSection } from '../components/explore/sections/InterestsSection';
import { EventsSection } from '../components/explore/sections/EventsSection';
import { WorldsSection } from '../components/explore/sections/WorldsSection';
import { LocationsSection } from '../components/explore/sections/LocationsSection';
import { SpacesSection } from '../components/explore/sections/SpacesSection';
import { ExperiencesSection } from '../components/explore/sections/ExperiencesSection';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('people');
  const { preferences, updatePreference } = useExplorePreferences();

  const renderContent = () => {
    switch (activeTab) {
      case 'people':
        return <PeopleSection preferences={preferences.people} onPreferenceChange={updatePreference('people')} />;
      case 'creators':
        return <CreatorsSection preferences={preferences.creators} onPreferenceChange={updatePreference('creators')} />;
      case 'style':
        return <StyleSection preferences={preferences.style} onPreferenceChange={updatePreference('style')} />;
      case 'interests':
        return <InterestsSection preferences={preferences.interests} onPreferenceChange={updatePreference('interests')} />;
      case 'events':
        return <EventsSection preferences={preferences.events} onPreferenceChange={updatePreference('events')} />;
      case 'worlds':
        return <WorldsSection />;
      case 'locations':
        return <LocationsSection />;
      case 'spaces':
        return <SpacesSection />;
      case 'experiences':
        return <ExperiencesSection />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-cormorant">
      <h1 className="text-3xl text-zinc-200 mb-8 font-light tracking-wide">
        Explore
      </h1>
      
      <ExploreNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {renderContent()}
    </div>
  );
};

export default Explore;
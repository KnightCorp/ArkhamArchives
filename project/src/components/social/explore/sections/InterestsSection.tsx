import React from "react";
import { InterestCard } from "../interests/InterestCard";
import { interests } from "../../data/interests";

export const InterestsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {interests.map((interest) => (
      <InterestCard key={interest.id} interest={interest} />
    ))}
  </div>
);

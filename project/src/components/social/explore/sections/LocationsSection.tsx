import React from "react";
import { cityLocations } from "../../data/cityLocations";
import { MapPin, Clock } from "lucide-react";

export const LocationsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {cityLocations.map((location) => (
      <div
        key={location.id}
        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
      >
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl text-zinc-200">{location.name}</h3>
            <span className="text-zinc-400">⭐ {location.rating}</span>
          </div>
          <div className="space-y-2 text-zinc-400">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {location.address} ({location.distance}km)
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{location.openHours}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

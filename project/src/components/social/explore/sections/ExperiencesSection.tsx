import React from "react";
import { experiences } from "../../data/experiences";
import { Clock, DollarSign } from "lucide-react";

export const ExperiencesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {experiences.map((exp) => (
      <div
        key={exp.id}
        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
      >
        <img
          src={exp.image}
          alt={exp.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl text-zinc-200">{exp.title}</h3>
            <span className="text-zinc-400">⭐ {exp.rating}</span>
          </div>
          <div className="space-y-2 text-zinc-400 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{exp.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>${exp.price}</span>
            </div>
          </div>
          <button className="w-full py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
            Book for {new Date(exp.nextAvailable).toLocaleDateString()}
          </button>
        </div>
      </div>
    ))}
  </div>
);

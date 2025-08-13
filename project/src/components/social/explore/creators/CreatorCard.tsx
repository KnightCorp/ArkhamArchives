import React from "react";
import { Plus } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  content: Record<string, number>;
  media: Array<{
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }>;
}

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard = ({ creator }: CreatorCardProps) => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="relative mb-4">
      <img
        src={creator.avatar}
        alt={creator.name}
        className="w-20 h-20 rounded-full mx-auto grayscale hover:grayscale-0 transition-all"
      />
      <button className="absolute bottom-0 right-12 bg-zinc-800 rounded-full p-1 hover:bg-zinc-700 transition-colors">
        <Plus className="w-4 h-4 text-zinc-200" />
      </button>
    </div>
    <div className="text-center mb-4">
      <h3 className="text-zinc-200 font-medium">{creator.name}</h3>
      <p className="text-zinc-400 text-sm">{creator.profession}</p>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {creator.media.map((item, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden">
          <img
            src={item.type === "video" ? item.thumbnail : item.url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
);

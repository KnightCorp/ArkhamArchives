import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AcademiaCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export const AcademiaCard = ({ icon: Icon, title, children }: AcademiaCardProps) => (
  <div className="bg-[#1a0f0f]/90 academia-border rounded-lg p-8 backdrop-blur-sm blood-scroll">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-[#0a0505] flex items-center justify-center border border-[#8B0000]/30 shadow-[0_0_15px_rgba(139,0,0,0.2)]">
        <Icon className="w-8 h-8 text-silver" />
      </div>
    </div>
    <h2 className="text-2xl academia-text text-silver mb-2">{title}</h2>
    <div className="text-silver/80 academia-text">
      {children}
    </div>
  </div>
);
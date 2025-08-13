import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const TabButton = ({ active, label, icon: Icon, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 transition-all academia-text ${
      active
        ? 'bg-[#1a0f0f] text-white border-b-2 border-[#8B0000] shadow-[0_4px_12px_rgba(139,0,0,0.3)]'
        : 'text-[#B8864D]/60 hover:bg-[#1a0f0f]/50 hover:text-[#B8864D]'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);
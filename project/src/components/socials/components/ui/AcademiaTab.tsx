import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AcademiaTabProps {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const AcademiaTab = ({ active, label, icon: Icon, onClick }: AcademiaTabProps) => (
  <button
    onClick={onClick}
    className={`academia-tab ${active ? 'academia-tab-active' : 'academia-tab-inactive'}`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);
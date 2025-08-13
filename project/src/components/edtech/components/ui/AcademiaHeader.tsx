import React from 'react';

interface AcademiaHeaderProps {
  title: string;
  subtitle?: string;
}

export const AcademiaHeader = ({ title, subtitle }: AcademiaHeaderProps) => (
  <div className="border-b border-[#8B0000]/20 pb-6 mb-8">
    <h1 className="text-3xl academia-text text-silver mb-2">
      {title}
    </h1>
    {subtitle && (
      <p className="text-silver/80 academia-text italic">
        {subtitle}
      </p>
    )}
  </div>
);
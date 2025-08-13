import React from 'react';
import { Newspaper, Globe, Users } from 'lucide-react';
import { SourceSection } from './SourceSection';

const primarySources = [
  {
    title: 'POLICE RECORDS',
    icon: Newspaper,
    items: [
      'Case Files #2045-A',
      'Incident Reports',
      'Arrest Records',
      'Evidence Logs',
      'Surveillance Reports',
      'Officer Statements'
    ]
  },
  {
    title: 'FIELD REPORTS',
    icon: Globe,
    items: [
      'Crime Scene Analysis',
      'Forensic Reports',
      'Witness Statements',
      'Location Surveys',
      'Physical Evidence',
      'Photo Documentation'
    ]
  },
  {
    title: 'DIRECT TESTIMONIES',
    icon: Users,
    items: [
      'Witness Interviews',
      'Suspect Interrogations',
      'Expert Testimonies',
      'Victim Statements',
      'Officer Accounts',
      'Informant Reports'
    ]
  }
];

export const PrimarySources = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {primarySources.map((section) => (
      <SourceSection key={section.title} {...section} />
    ))}
  </div>
);
import React from 'react';
import { FileText, Database, Link } from 'lucide-react';
import { SourceSection } from './SourceSection';

const secondarySources = [
  {
    title: 'ARCHIVED RECORDS',
    icon: FileText,
    items: [
      'Historical Cases',
      'Cold Case Files',
      'Department Archives',
      'Previous Investigations',
      'Related Incidents',
      'Pattern Analysis'
    ]
  },
  {
    title: 'DATABASE ENTRIES',
    icon: Database,
    items: [
      'Criminal Records',
      'Forensic Database',
      'Evidence Catalog',
      'Personnel Files',
      'Location History',
      'Case References'
    ]
  },
  {
    title: 'EXTERNAL SOURCES',
    icon: Link,
    items: [
      'News Archives',
      'Public Records',
      'Academic Research',
      'Expert Consultations',
      'Agency Reports',
      'Legal Documents'
    ]
  }
];

export const SecondarySources = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {secondarySources.map((section) => (
      <SourceSection key={section.title} {...section} />
    ))}
  </div>
);
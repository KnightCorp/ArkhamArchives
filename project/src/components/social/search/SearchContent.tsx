import React from 'react';
import { PrimarySources } from './sources/PrimarySources';
import { SecondarySources } from './sources/SecondarySources';
import { Analysis } from './sources/Analysis';
import { Reports } from './Reports';
import { Navigation } from './Navigation';
import { P2PSearch } from './P2PSearch';
import { WebBrowser } from './WebBrowser';
import { PrepTime } from './PrepTime';
import { Customization } from './Customization';

interface SearchContentProps {
  activeTab: string;
}

export const SearchContent = ({ activeTab }: SearchContentProps) => {
  switch (activeTab) {
    case 'primary':
      return <PrimarySources />;
    case 'secondary':
      return <SecondarySources />;
    case 'analysis':
      return <Analysis />;
    case 'reports':
      return <Reports />;
    case 'navigation':
      return <Navigation />;
    case 'p2p':
      return <P2PSearch />;
    case 'browser':
      return <WebBrowser />;
    case 'prep':
      return <PrepTime />;
    case 'customization':
      return <Customization />;
    default:
      return null;
  }
};
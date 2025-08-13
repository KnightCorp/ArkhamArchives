import React from "react";
import { PrimarySources } from "../search/sources/PrimarySources";
import { SecondarySources } from "../search/sources/SecondarySources";
import { Analysis } from "../search/sources/Analysis";
import { Reports } from "../search/Reports";
import { Navigation } from "../search/Navigation";
import { P2PSearch } from "../search/P2PSearch";
import { WebBrowser } from "../search/WebBrowser";
import { PrepTime } from "../search/PrepTime";
import { Customization } from "../search/Customization";

interface SearchContentProps {
  activeTab: string;
}

export const SearchContent = ({ activeTab }: SearchContentProps) => {
  switch (activeTab) {
    case "primary":
      return <PrimarySources />;
    case "secondary":
      return <SecondarySources />;
    case "analysis":
      return <Analysis />;
    case "reports":
      return <Reports />;
    case "navigation":
      return <Navigation />;
    case "p2p":
      return <P2PSearch />;
    case "browser":
      return <WebBrowser />;
    case "prep":
      return <PrepTime />;
    case "customization":
      return <Customization />;
    default:
      return null;
  }
};

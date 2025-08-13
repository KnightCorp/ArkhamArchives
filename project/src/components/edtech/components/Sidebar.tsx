import React from "react";
import { Title } from "./ui/Typography";
import NavItems from "./navigation/NavItems";

const Sidebar = () => {
  return (
    <nav className="w-64 border-r border-zinc-800/50 px-4 py-6 bg-zinc-950/90 backdrop-blur-sm metallic-shine">
      <div className="mb-8">
        {/* <Title className="text-white text-glow">Noir</Title> */}
      </div>
      <NavItems />
    </nav>
  );
};

export default Sidebar;

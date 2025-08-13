import React from "react";
import { StyleCard } from "../style/StyleCard";
import { styles } from "../../data/styles";

export const StyleSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {styles.map((style) => (
      <StyleCard key={style.id} style={style} />
    ))}
  </div>
);

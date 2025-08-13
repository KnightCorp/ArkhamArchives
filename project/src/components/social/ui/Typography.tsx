import React from "react";
import { theme } from "../styles/theme";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className = "" }: TypographyProps) => (
  <h1
    className={`font-[Batman Arkham] text-2xl ${className}`}
    style={{ fontFamily: theme.fonts.detective }}
  >
    {children}
  </h1>
);

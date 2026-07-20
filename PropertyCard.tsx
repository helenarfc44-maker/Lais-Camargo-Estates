import React from "react";

interface LaisLogoProps {
  className?: string;
}

export function LaisLogo({ className = "h-8 w-auto" }: LaisLogoProps) {
  return (
    <svg
      viewBox="0 0 180 82"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lais Camargo Estates"
    >
      <g fill="currentColor">
        {/* LAIS */}
        <text
          x="50%"
          y="25"
          textAnchor="middle"
          style={{
            fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
            fontSize: "24px",
            fontWeight: 400,
            letterSpacing: "0.22em",
          }}
        >
          LAIS
        </text>
        {/* CAMARGO */}
        <text
          x="50%"
          y="51"
          textAnchor="middle"
          style={{
            fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
            fontSize: "24px",
            fontWeight: 400,
            letterSpacing: "0.22em",
          }}
        >
          CAMARGO
        </text>
        {/* ESTATES */}
        <text
          x="50%"
          y="71"
          textAnchor="middle"
          style={{
            fontFamily: "'Inter', 'Montserrat', 'Helvetica Neue', sans-serif",
            fontSize: "8.5px",
            fontWeight: 400,
            letterSpacing: "0.45em",
          }}
        >
          ESTATES
        </text>
      </g>
    </svg>
  );
}

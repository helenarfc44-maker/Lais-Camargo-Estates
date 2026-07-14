import React, { useState } from "react";

const TONES = [
  "linear-gradient(135deg,#3d564f 0%,#6d8f87 55%,#a9c6bf 100%)",
  "linear-gradient(160deg,#4a635c 0%,#7fa198 60%,#b8d0ca 100%)",
  "linear-gradient(120deg,#33493f 0%,#5c7d74 50%,#93b3ab 100%)",
  "linear-gradient(150deg,#55706a 0%,#84a49c 55%,#c0d6d0 100%)",
  "linear-gradient(140deg,#3f5852 0%,#6e908a 55%,#a4c0b9 100%)",
  "linear-gradient(125deg,#465f57 0%,#78998f 60%,#b1cbc4 100%)",
  "linear-gradient(155deg,#3a534b 0%,#69897f 50%,#9dbcb3 100%)",
  "linear-gradient(130deg,#2f453e 0%,#5f7f76 55%,#96b5ad 100%)",
];

interface FotoProps {
  tone: number;
  src?: string;
  zoom?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Foto({ tone, src, zoom, className = "", children }: FotoProps) {
  const [err, setErr] = useState(false);
  return (
    <div className={"relative overflow-hidden " + className} style={{ background: TONES[tone % TONES.length] }}>
      {src && !err ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setErr(true)}
          className={"absolute inset-0 w-full h-full object-cover " + (zoom ? "transition-transform duration-500 group-hover:scale-105" : "")}
        />
      ) : (
        <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(90deg,transparent 0 46px,rgba(255,255,255,.1) 46px 48px)" }} />
      )}
      {children}
    </div>
  );
}

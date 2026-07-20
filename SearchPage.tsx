import { useState } from "react";

interface LogoImgProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClass?: string;
}

export function LogoImg({ src, alt, className = "", fallbackClass = "" }: LogoImgProps) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <span className={fallbackClass} style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.22em" }}>
        {alt}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setErr(true)}
    />
  );
}

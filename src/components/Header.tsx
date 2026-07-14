import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { LaisLogo } from "./LaisLogo";

interface HeaderProps {
  onNav: (page: string, anchor?: string) => void;
}

export function Header({ onNav }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const link = (label: string, action: () => void) => (
    <button
      onClick={() => {
        action();
        setOpen(false);
      }}
      className="text-white text-sm tracking-widest uppercase hover:opacity-75 transition-opacity py-2 px-3 text-left w-full md:w-auto cursor-pointer focus:outline-none"
      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
    >
      {label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-verde/95 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
        {/* Logo and Partner */}
        <button
          onClick={() => onNav("home")}
          className="flex items-center focus:outline-none cursor-pointer"
        >
          <LaisLogo className="h-10 sm:h-11 w-auto text-white" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {link("Home", () => onNav("home"))}
          {link("Buscar Imóveis", () => onNav("search"))}
          {link("Quem Somos", () => onNav("home", "#sobre"))}
          {link("Contato", () => onNav("home", "#contato"))}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:opacity-75 transition-opacity p-2"
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 focus:outline-none cursor-pointer rounded-md hover:bg-white/10"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-start gap-4 px-6 pb-8 pt-4 bg-verde-profundo border-t border-white/10 shadow-lg animate-fadeIn">
          {link("Home", () => onNav("home"))}
          {link("Buscar Imóveis", () => onNav("search"))}
          {link("Quem Somos", () => onNav("home", "#sobre"))}
          {link("Contato", () => onNav("home", "#contato"))}
          <div className="flex items-center gap-4 pt-3 border-t border-white/10 w-full pl-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white p-2 hover:bg-white/10 rounded-full"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

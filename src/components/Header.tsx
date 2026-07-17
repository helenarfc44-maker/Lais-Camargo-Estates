import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { LaisLogo } from "./LaisLogo";

interface HeaderProps {
  onNav: (page: string, anchor?: string) => void;
  currentPage?: string;
}

export function Header({ onNav, currentPage = "home" }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const link = (label: string, id: string, action: () => void) => {
    const isActive = currentPage === id;
    
    return (
      <button
        onClick={() => {
          action();
          setOpen(false);
        }}
        className={`text-white text-[15px] hover:opacity-75 transition-all py-2 text-left w-full md:w-auto cursor-pointer focus:outline-none relative group`}
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
      >
        {label}
        {/* Underline for active state and hover */}
        <span className={`absolute left-0 -bottom-1 w-full h-[1px] bg-white transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-verde/95 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 h-28 flex items-center justify-between">
        {/* Logo and Partner */}
        <div className="flex items-center">
          <button
            onClick={() => onNav("home")}
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <LaisLogo className="h-14 sm:h-16 w-auto text-white" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {link("Home", "home", () => onNav("home"))}
          {link("Buscar Imóveis", "search", () => onNav("search"))}
          {link("Contato", "contato", () => onNav("home", "#contato"))}
          {link("Quem somos", "sobre", () => onNav("home", "#sobre"))}
          <a
            href="https://instagram.com/laiscamargoimoveis"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:opacity-75 transition-opacity p-2 ml-2 flex items-center justify-center"
            aria-label="Instagram"
          >
            <Instagram size={22} strokeWidth={1.5} />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 focus:outline-none cursor-pointer rounded-md hover:bg-white/10"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-start gap-4 px-6 pb-8 pt-4 bg-verde-profundo border-t border-white/10 shadow-lg animate-fadeIn">
          {link("Home", "home", () => onNav("home"))}
          {link("Buscar Imóveis", "search", () => onNav("search"))}
          {link("Contato", "contato", () => onNav("home", "#contato"))}
          {link("Quem somos", "sobre", () => onNav("home", "#sobre"))}
          <div className="flex items-center gap-4 pt-3 border-t border-white/10 w-full pl-3">
            <a
              href="https://instagram.com/laiscamargoimoveis"
              target="_blank"
              rel="noreferrer"
              className="text-white p-2 hover:bg-white/10 rounded-full"
              aria-label="Instagram"
            >
              <Instagram size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

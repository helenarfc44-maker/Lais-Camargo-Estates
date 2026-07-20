import { Instagram, MessageCircle, Mail } from "lucide-react";
import { LaisLogo } from "./LaisLogo";

const WHATSAPP = "https://wa.me/5511991851032";
const EMAIL = "lais@c5.com.br";

interface FooterProps {
  onNav: (page: string, anchor?: string) => void;
}

export function Footer({ onNav }: FooterProps) {
  return (
    <footer className="text-white bg-verde-profundo">
      <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Branding Col */}
        <div className="flex flex-col items-start text-left space-y-4">
          <div className="w-40 md:w-48 mb-2 -ml-2">
            <LaisLogo className="w-full h-auto text-white" />
          </div>
          <div className="flex flex-col items-start text-left">
            <p className="text-sm leading-relaxed opacity-80 font-sans font-light" style={{ maxWidth: "300px" }}>
              Imóveis de alto padrão e curadoria imobiliária premium nas regiões mais nobres de São Paulo.
            </p>
            <p className="text-xs opacity-60 font-sans font-light mt-3" style={{ maxWidth: "300px" }}>
              CRECI: 76056
            </p>
          </div>
        </div>

        {/* Contact Links Col */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-medium text-white/90">Fale Conosco</h4>
          <div className="space-y-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity text-sm font-sans font-light py-1"
            >
              <MessageCircle size={16} strokeWidth={1.5} className="text-verde" />
              <span>(11) 99185-1032</span>
            </a>
            <a
              href={"mailto:" + EMAIL}
              className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity text-sm font-sans font-light py-1"
            >
              <Mail size={16} strokeWidth={1.5} className="text-verde" />
              <span>{EMAIL}</span>
            </a>
            <a
              href="https://instagram.com/laiscamargoimoveis"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity text-sm font-sans font-light py-1"
            >
              <Instagram size={16} strokeWidth={1.5} className="text-verde" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Sitemap Col */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-medium text-white/90">Navegação</h4>
          <div className="flex flex-col gap-3 text-sm opacity-80 font-sans font-light">
            <button
              onClick={() => onNav("home")}
              className="text-left hover:opacity-100 transition-opacity hover:text-verde cursor-pointer focus:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => onNav("search")}
              className="text-left hover:opacity-100 transition-opacity hover:text-verde cursor-pointer focus:outline-none"
            >
              Buscar Imóveis
            </button>
            <button
              onClick={() => onNav("home", "#sobre")}
              className="text-left hover:opacity-100 transition-opacity hover:text-verde cursor-pointer focus:outline-none"
            >
              Quem Somos
            </button>
            <button
              onClick={() => onNav("home", "#contato")}
              className="text-left hover:opacity-100 transition-opacity hover:text-verde cursor-pointer focus:outline-none"
            >
              Contato
            </button>
          </div>
        </div>
      </div>

      {/* Copy & Developer Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-70 font-sans font-light text-center md:text-left">
            Copyright © {new Date().getFullYear()} Lais Camargo Estates. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

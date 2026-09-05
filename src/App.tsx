import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { SearchPage } from "./components/SearchPage";
import { DetailPage } from "./components/DetailPage";
import { Footer } from "./components/Footer";
import { Imovel, Filtros } from "./types";

const FILTROS_INICIAIS: Filtros = {
  operacao: "venda",
  precoMin: "",
  precoMax: "",
  areaUtilMin: "",
  areaUtilMax: "",
  areaTotalMin: "",
  areaTotalMax: "",
  dorms: 0,
  suites: 0,
  banheiros: 0,
  vagas: 0,
  bairros: [],
  tipos: [],
  caracteristicas: [],
  exclusividades: false,
  lancamentos: false,
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);

  const onNav = (path: string, anchor?: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    
    // Smooth scroll handling for anchors (e.g. #sobre, #contato)
    setTimeout(() => {
      if (anchor) {
        const el = document.querySelector(anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else if (location.pathname !== path) {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    }, 60);
  };

  const goSearchTipo = (tipos: string[]) => {
    setFiltros({ ...FILTROS_INICIAIS, tipos });
    onNav("/busca");
  };

  const onOpen = (p: Imovel) => {
    const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = slugify(p.tipo + " com " + p.areaUtil + "-0 m2 a venda no bairro " + p.bairro) + "-" + p.codigo;
    onNav(`/imovel/${slug}`);
  };

  // Determine current page for Header highlight
  const currentPage = location.pathname === "/" ? "home" : location.pathname.startsWith("/busca") ? "search" : "detail";

  return (
    <div className="bg-white min-h-screen text-texto-escuro font-sans antialiased selection:bg-verde/30">
      {/* Universal Sticky Header */}
      <Header onNav={onNav} currentPage={currentPage} />

      {/* Main Pages */}
      <main className="min-h-[calc(100vh-112px)]">
        <Routes>
          <Route path="/" element={<Home onNav={onNav} goSearchTipo={goSearchTipo} onOpen={onOpen} />} />
          <Route path="/busca" element={<SearchPage filtros={filtros} setFiltros={setFiltros} onOpen={onOpen} />} />
          <Route path="/imovel/:slug" element={<DetailPage onBack={() => onNav("/busca")} onOpen={onOpen} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Universal Footer */}
      <Footer onNav={onNav} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

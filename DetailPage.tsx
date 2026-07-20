import { useState, useEffect } from "react";
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

export default function App() {
  const [page, setPage] = useState("home");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const [selecionado, setSelecionado] = useState<Imovel | null>(null);

  const onNav = (p: string, anchor?: string) => {
    setPage(p);
    
    // Smooth scroll handling for anchors (e.g. #sobre, #contato)
    setTimeout(() => {
      if (anchor) {
        const el = document.querySelector(anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    }, 60);
  };

  const onOpen = (p: Imovel) => {
    setSelecionado(p);
    onNav("detail");
  };

  const goSearchTipo = (tipos: string[]) => {
    setFiltros({ ...FILTROS_INICIAIS, tipos });
    onNav("search");
  };

  // Reset page title dynamically based on location
  useEffect(() => {
    if (page === "home") {
      document.title = "Lais Camargo | Imóveis de Luxo em São Paulo";
    } else if (page === "search") {
      document.title = "Buscar Imóveis | Lais Camargo";
    } else if (page === "detail" && selecionado) {
      document.title = `${selecionado.tipo} no ${selecionado.bairro} | Lais Camargo`;
    }
  }, [page, selecionado]);

  return (
    <div className="bg-white min-h-screen text-texto-escuro font-sans antialiased selection:bg-verde/30">
      {/* Universal Sticky Header */}
      <Header onNav={onNav} currentPage={page} />

      {/* Main Pages */}
      <main className="min-h-[calc(100vh-112px)]">
        {page === "home" && (
          <Home onNav={onNav} goSearchTipo={goSearchTipo} onOpen={onOpen} />
        )}
        {page === "search" && (
          <SearchPage filtros={filtros} setFiltros={setFiltros} onOpen={onOpen} />
        )}
        {page === "detail" && selecionado && (
          <DetailPage p={selecionado} onBack={() => onNav("search")} onOpen={onOpen} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNav={onNav} />
    </div>
  );
}

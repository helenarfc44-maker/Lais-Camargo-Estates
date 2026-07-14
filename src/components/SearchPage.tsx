import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Imovel, Filtros } from "../types";
import { PropertyCard } from "./PropertyCard";
import data from "../data/imoveis.json";

interface SearchPageProps {
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  onOpen: (p: Imovel) => void;
}

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

export function SearchPage({ filtros, setFiltros, onOpen }: SearchPageProps) {
  const IMOVEIS: Imovel[] = data.imoveis;
  const BAIRROS: string[] = data.bairros;
  const TIPOS: string[] = data.tipos;
  const CARACTERISTICAS: string[] = data.caracteristicas;

  const [drawer, setDrawer] = useState(false);
  const [visiveis, setVisiveis] = useState(6);
  const [busca, setBusca] = useState("");
  const f = filtros;

  const resultado = useMemo(() => {
    return IMOVEIS.filter((p) => {
      if (busca && !p.codigo.toLowerCase().includes(busca.toLowerCase())) return false;
      if (f.operacao && p.operacao !== f.operacao) return false;
      if (f.precoMin && p.preco < Number(f.precoMin)) return false;
      if (f.precoMax && p.preco > Number(f.precoMax)) return false;
      if (f.areaUtilMin && p.areaUtil < Number(f.areaUtilMin)) return false;
      if (f.areaUtilMax && p.areaUtil > Number(f.areaUtilMax)) return false;
      if (f.areaTotalMin && p.areaTotal < Number(f.areaTotalMin)) return false;
      if (f.areaTotalMax && p.areaTotal > Number(f.areaTotalMax)) return false;
      if (f.dorms && p.dorms < f.dorms) return false;
      if (f.suites && p.suites < f.suites) return false;
      if (f.banheiros && p.banheiros < f.banheiros) return false;
      if (f.vagas && p.vagas < f.vagas) return false;
      if (f.bairros.length && !f.bairros.includes(p.bairro)) return false;
      if (f.tipos.length && !f.tipos.includes(p.tipo)) return false;
      if (f.caracteristicas.length && !f.caracteristicas.every((c) => p.caracteristicas.includes(c))) return false;
      if (f.exclusividades && !p.exclusivo) return false;
      if (f.lancamentos && !p.lancamento) return false;
      return true;
    });
  }, [f, busca]);

  const toggleFilter = (key: keyof Filtros, v: string) => {
    const list = f[key] as string[];
    const updated = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
    setFiltros({ ...f, [key]: updated });
  };

  const handleClearFilters = () => {
    setFiltros(FILTROS_INICIAIS);
    setBusca("");
  };

  const chip = (label: string) => (
    <button
      onClick={() => setDrawer(true)}
      className="hover-verde flex items-center gap-1.5 border border-[#1a1a1a]/15 px-4 py-2 text-xs text-gray-600 transition-colors whitespace-nowrap bg-white cursor-pointer rounded-[2px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {label} <ChevronDown size={12} />
    </button>
  );

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <h1 className="text-3xl md:text-4xl mb-2 font-serif text-texto-escuro font-medium">Buscar Imóveis</h1>
        <p className="text-gray-500 text-sm mb-10 font-sans font-light">
          {resultado.length} {resultado.length === 1 ? "imóvel de luxo disponível" : "imóveis de luxo disponíveis"} em São Paulo
        </p>

        {/* Search bar & filter trigger row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 border-b border-gray-200 scrollbar-none">
          <div className="relative flex-shrink-0">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por referência"
              className="input-verde border border-gray-200 pl-4 pr-9 py-2.5 text-xs focus:outline-none w-48 font-sans text-texto-escuro bg-white rounded-[2px]"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setDrawer(true)}
            className="btn-verde flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase whitespace-nowrap font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Filtrar <SlidersHorizontal size={13} />
          </button>
          {chip("Valores")}
          {chip("Metragem")}
          {chip("Ambientes")}
          {chip("Localização")}
          {chip("Tipo de imóvel")}
        </div>

        {/* Results grid */}
        {resultado.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-lg">
            <h3 className="text-2xl mb-3 font-serif text-texto-escuro font-medium">Nenhum imóvel encontrado</h3>
            <p className="text-gray-500 text-sm mb-8 font-sans font-light max-w-md mx-auto leading-relaxed">
              Não encontramos propriedades correspondentes a essa combinação de filtros. Tente expandir sua busca.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-outline-verde px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-medium"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resultado.slice(0, visiveis).map((p) => (
                <PropertyCard key={p.id} p={p} onOpen={onOpen} />
              ))}
            </div>
            {visiveis < resultado.length && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisiveis(visiveis + 6)}
                  className="btn-outline-verde px-10 py-4.5 text-xs tracking-[0.25em] uppercase font-sans font-medium"
                >
                  Carregar Mais Imóveis
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Advanced Filters Drawer (Mobile-first, slides in from right) */}
      {drawer && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity duration-300" onClick={() => setDrawer(false)} />
      )}
      <aside
        className={
          "fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 flex flex-col shadow-2xl " +
          (drawer ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-150">
          <h3 className="text-xl font-serif text-texto-escuro font-medium">Filtros Avançados</h3>
          <button onClick={() => setDrawer(false)} className="hover:opacity-75 cursor-pointer text-texto-escuro p-2">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-white">
          {/* Operation type */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Tipo de Operação</p>
            <div className="flex border border-gray-200 w-fit rounded-sm overflow-hidden">
              {["venda", "aluguel"].map((op) => (
                <button
                  key={op}
                  onClick={() => setFiltros({ ...f, operacao: op })}
                  className={"px-6 py-3 text-xs uppercase tracking-widest font-sans font-medium transition-colors cursor-pointer " + (f.operacao === op ? "sel-verde" : "bg-white text-gray-600 hover:bg-gray-50")}
                >
                  {op === "venda" ? "Venda" : "Locação"}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Range */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Faixa de Preço (R$)</p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Mínimo"
                value={f.precoMin}
                onChange={(e) => setFiltros({ ...f, precoMin: e.target.value })}
                className="input-verde w-1/2 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none bg-white font-sans text-texto-escuro rounded-[2px]"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={f.precoMax}
                onChange={(e) => setFiltros({ ...f, precoMax: e.target.value })}
                className="input-verde w-1/2 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none bg-white font-sans text-texto-escuro rounded-[2px]"
              />
            </div>
          </div>

          {/* Useful Area Range */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Área Útil (m²)</p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Mínimo m²"
                value={f.areaUtilMin}
                onChange={(e) => setFiltros({ ...f, areaUtilMin: e.target.value })}
                className="input-verde w-1/2 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none bg-white font-sans text-texto-escuro rounded-[2px]"
              />
              <input
                type="number"
                placeholder="Máximo m²"
                value={f.areaUtilMax}
                onChange={(e) => setFiltros({ ...f, areaUtilMax: e.target.value })}
                className="input-verde w-1/2 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none bg-white font-sans text-texto-escuro rounded-[2px]"
              />
            </div>
          </div>

          {/* Bed & Suites Selectors */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Dormitórios</p>
            <div className="flex gap-1.5 flex-wrap">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setFiltros({ ...f, dorms: n })}
                  className={"px-4 py-2.5 text-xs border transition-colors rounded-[2px] cursor-pointer " + (f.dorms === n ? "sel-verde" : "hover-verde bg-white text-gray-600 border-gray-200")}
                >
                  {n === 0 ? "Qualquer" : n + "+"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Suítes</p>
            <div className="flex gap-1.5 flex-wrap">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setFiltros({ ...f, suites: n })}
                  className={"px-4 py-2.5 text-xs border transition-colors rounded-[2px] cursor-pointer " + (f.suites === n ? "sel-verde" : "hover-verde bg-white text-gray-600 border-gray-200")}
                >
                  {n === 0 ? "Qualquer" : n + "+"}
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhoods (Bairros) Multi-Select */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Regiões / Bairros</p>
            <div className="flex gap-2 flex-wrap">
              {BAIRROS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleFilter("bairros", b)}
                  className={"px-3 py-2 text-xs border transition-all rounded-[2px] cursor-pointer " + (f.bairros.includes(b) ? "sel-verde shadow-xs" : "hover-verde bg-white text-gray-600 border-gray-200")}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Types (Tipos) Multi-Select */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Tipo de Imóvel</p>
            <div className="flex gap-2 flex-wrap">
              {TIPOS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleFilter("tipos", t)}
                  className={"px-3 py-2 text-xs border transition-all rounded-[2px] cursor-pointer " + (f.tipos.includes(t) ? "sel-verde shadow-xs" : "hover-verde bg-white text-gray-600 border-gray-200")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Features (Características) Multi-Select */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3 font-sans font-semibold">Características</p>
            <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto p-1 border border-black/5 rounded-[2px]">
              {CARACTERISTICAS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleFilter("caracteristicas", c)}
                  className={"px-3 py-1.5 text-xs border transition-all rounded-[2px] cursor-pointer " + (f.caracteristicas.includes(c) ? "sel-verde shadow-xs" : "hover-verde bg-white text-gray-600 border-gray-200")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Status Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer font-sans select-none">
              <input
                type="checkbox"
                checked={f.exclusividades}
                onChange={(e) => setFiltros({ ...f, exclusividades: e.target.checked })}
                className="w-4.5 h-4.5 rounded border-gray-200 focus:ring-verde-profundo cursor-pointer"
                style={{ accentColor: "var(--color-verde)" }}
              />
              <span className="font-light">Exibir apenas Exclusividades</span>
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer font-sans select-none">
              <input
                type="checkbox"
                checked={f.lancamentos}
                onChange={(e) => setFiltros({ ...f, lancamentos: e.target.checked })}
                className="w-4.5 h-4.5 rounded border-gray-200 focus:ring-verde-profundo cursor-pointer"
                style={{ accentColor: "var(--color-verde)" }}
              />
              <span className="font-light">Exibir apenas Lançamentos</span>
            </label>
          </div>
        </div>

        {/* Footer actions inside Drawer */}
        <div className="border-t border-gray-200 px-6 py-5 flex gap-3 bg-gray-50">
          <button
            onClick={handleClearFilters}
            className="btn-outline-verde flex-1 py-3.5 text-xs tracking-wider uppercase font-medium"
          >
            Limpar
          </button>
          <button
            onClick={() => setDrawer(false)}
            className="btn-verde flex-1 py-3.5 text-xs tracking-wider uppercase font-medium"
          >
            Filtrar ({resultado.length})
          </button>
        </div>
      </aside>
    </div>
  );
}

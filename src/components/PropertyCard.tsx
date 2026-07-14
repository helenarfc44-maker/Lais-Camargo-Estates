import React from "react";
import { BedDouble, Bath, Car, Ruler } from "lucide-react";
import { Imovel } from "../types";
import { Foto } from "./Foto";

interface PropertyCardProps {
  key?: any;
  p: Imovel;
  onOpen: (p: Imovel) => void;
}

const fmtPreco = (v: number) => "R$ " + new Intl.NumberFormat("pt-BR").format(v);

export function PropertyCard({ p, onOpen }: PropertyCardProps) {
  return (
    <div
      onClick={() => onOpen(p)}
      className="group bg-white border border-[#1a1a1a]/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col h-full rounded-[2px]"
    >
      <Foto tone={p.tone} src={p.img} zoom className="aspect-[4/3] w-full">
        {p.exclusivo && (
          <span
            className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium shadow-xs"
            style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#8d7b68", color: "#ffffff" }}
          >
            Exclusivo
          </span>
        )}
        {p.lancamento && (
          <span
            className="absolute top-4 right-4 bg-white text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium text-verde-profundo shadow-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Lançamento
          </span>
        )}
      </Foto>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-lg font-serif text-texto-escuro line-clamp-1">{p.tipo}</h3>
          <span className="text-[11px] text-gray-400 tracking-widest font-sans font-medium">{p.codigo}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4 font-sans font-light">{p.bairro} · São Paulo</p>
        
        {/* Amenities Icons */}
        <div className="flex items-center gap-4 text-gray-600 text-xs mb-5 flex-wrap font-sans mt-auto border-t border-[#1a1a1a]/5 pt-4">
          <span className="flex items-center gap-1.5" title="Área Útil">
            <Ruler size={14} strokeWidth={1.5} className="text-verde" />
            {p.areaUtil} m²
          </span>
          <span className="flex items-center gap-1.5" title="Dormitórios">
            <BedDouble size={14} strokeWidth={1.5} className="text-verde" />
            {p.dorms} {p.dorms === 1 ? "dorm" : "dorms"}
          </span>
          <span className="flex items-center gap-1.5" title="Banheiros">
            <Bath size={14} strokeWidth={1.5} className="text-verde" />
            {p.banheiros} {p.banheiros === 1 ? "banh" : "banhs"}
          </span>
          <span className="flex items-center gap-1.5" title="Vagas de Garagem">
            <Car size={14} strokeWidth={1.5} className="text-verde" />
            {p.vagas} {p.vagas === 1 ? "vaga" : "vagas"}
          </span>
        </div>
        <p className="text-xl font-serif text-verde font-semibold">{fmtPreco(p.preco)}</p>
      </div>
    </div>
  );
}

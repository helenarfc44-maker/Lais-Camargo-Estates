import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BedDouble, Bath, Car, Ruler, ArrowLeft, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Imovel } from "../types";
import { PropertyCard } from "./PropertyCard";
import { Foto } from "./Foto";
import data from "../data/imoveis.json";

const WHATSAPP = "https://wa.me/5511991851032";

interface DetailPageProps {
  onBack: () => void;
  onOpen: (p: Imovel) => void;
}

const fmtPreco = (v: number) => "R$ " + new Intl.NumberFormat("pt-BR").format(v);
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function DetailPage({ onBack, onOpen }: DetailPageProps) {
  const { slug } = useParams();
  const IMOVEIS: Imovel[] = data.imoveis;

  const p = useMemo(() => {
    return IMOVEIS.find(x => {
      const xSlug = slugify(x.tipo + " com " + x.areaUtil + "-0 m2 a venda no bairro " + x.bairro) + "-" + x.codigo;
      return xSlug === slug;
    });
  }, [slug, IMOVEIS]);

  const [fotoAtiva, setFotoAtiva] = useState(0);

  useEffect(() => {
    if (p) {
      document.title = `${p.tipo} no ${p.bairro} | Lais Camargo`;
    }
  }, [p]);

  const [form, setForm] = useState({ nome: "", email: "", tel: "", msg: "" });

  useEffect(() => {
    if (p) {
      setForm(prev => ({ ...prev, msg: `Gostaria de solicitar informações e agendar visita para o imóvel ${p.codigo} (${p.tipo} - ${p.bairro}).` }));
    }
  }, [p]);

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Galeria: usa o array de fotos quando existir, senão a foto principal.
  const galeria = useMemo(() => {
    if (!p) return [];
    const fotos = (p as any).fotos as string[] | undefined;
    if (fotos && fotos.length > 0) return fotos;
    return [p.img];
  }, [p]);

  const miniaturas = useMemo(() => galeria.slice(1, 5), [galeria]);

  const similares = useMemo(() => {
    if (!p) return [];
    return IMOVEIS.filter((x) => x.tipo === p.tipo && x.id !== p.id).slice(0, 3);
  }, [p, IMOVEIS]);

  if (!p) {
    return (
      <div className="pt-28 min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-texto-escuro mb-4">Imóvel não encontrado</h2>
        <button onClick={onBack} className="btn-outline-verde px-6 py-2 text-xs uppercase font-medium">Voltar</button>
      </div>
    );
  }

  const descricao = (p as any).descricao as string | undefined;
  const temBanheiros = typeof p.banheiros === "number" && p.banheiros > 0;
  const condominio = (p as any).condominio as number | null | undefined;
  const iptu = (p as any).iptu as number | null | undefined;
  const valorM2 = typeof p.preco === "number" && p.areaUtil > 0
    ? Math.round(p.preco / p.areaUtil)
    : null;
  const altFoto = `${p.tipo} de ${p.areaUtil} m² à venda no ${p.bairro}, São Paulo. Referência ${p.codigo}`;

  const zapMsg = WHATSAPP + "?text=" + encodeURIComponent(
    `Olá Lais Camargo! Tenho interesse no imóvel ${p.codigo} (${p.tipo} no bairro ${p.bairro} de ${p.areaUtil}m²). Gostaria de agendar uma visita e receber mais informações.`
  );

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": p.tipo === "Apartamento" || p.tipo === "Cobertura" ? "Apartment" : "SingleFamilyResidence",
    "name": `${p.tipo} no ${p.bairro} - Lais Camargo Estates`,
    "description": `${p.tipo} com ${p.areaUtil} m² de área útil, ${p.dorms} dormitórios (${p.suites} suítes) e ${p.vagas} vagas no bairro ${p.bairro}, São Paulo.`,
    "url": `https://www.laiscamargoestates.com.br/imovel/${slug}`,
    "image": p.img,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "numberOfRooms": p.dorms,
    "numberOfBedrooms": p.dorms,
    "photo": (galeria || []).slice(0, 10),
    "amenityFeature": (p.caracteristicas || []).map((c) => ({
      "@type": "LocationFeatureSpecification",
      "name": c,
      "value": true
    })),
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": p.areaUtil,
      "unitCode": "MTK"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": p.preco,
      "availability": "https://schema.org/InStock"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.msg) {
      setError("Por favor, preencha todos os campos obrigatórios (Nome e E-mail).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          codigoImovel: p.codigo
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSent(true);
      } else {
        setError(result.message || "Erro ao enviar a proposta. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Verifique se o servidor está online.");
    } finally {
      setSubmitting(false);
    }
  };

  const slugImovel = `/imovel/${slugify(p.tipo + " com " + p.areaUtil + "-0 m2 a venda no bairro " + p.bairro)}-${p.codigo}`;

  return (
    <div className="pt-28 min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Back navigation & breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs tracking-widest uppercase hover:text-verde-hover transition-colors font-sans font-medium text-verde-profundo cursor-pointer focus:outline-none"
          >
            <ArrowLeft size={14} /> Voltar para a busca
          </button>
          <span className="text-[10px] md:text-[11px] text-gray-400 font-sans font-light truncate max-w-full">
            laiscamargoestates.com.br{slugImovel}
          </span>
        </div>

        {/* Interactive Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          <Foto tone={p.tone} src={galeria[fotoAtiva]} alt={altFoto} className="lg:col-span-2 aspect-[16/10] rounded-sm shadow-xs">
            {p.exclusivo && (
              <span
                className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium shadow-xs"
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--color-verde)", color: "var(--color-texto-escuro)" }}
              >
                Exclusivo
              </span>
            )}
            {galeria.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => setFotoAtiva((i) => (i - 1 + galeria.length) % galeria.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white text-texto-escuro w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Próxima foto"
                  onClick={() => setFotoAtiva((i) => (i + 1) % galeria.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white text-texto-escuro w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
                <span className="absolute bottom-3 right-3 z-10 bg-black/55 text-white text-[11px] tracking-wider px-2.5 py-1 rounded-[2px] font-sans">
                  {fotoAtiva + 1} / {galeria.length}
                </span>
              </>
            )}
          </Foto>

          {galeria.length > 1 && (
            <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 lg:grid-rows-2 lg:h-full">
              {miniaturas.map((g, i) => {
                const indice = i + 1;
                const ultima = i === miniaturas.length - 1;
                const restantes = galeria.length - miniaturas.length - 1;
                return (
                  <button
                    key={indice}
                    type="button"
                    onClick={() => setFotoAtiva(ultima && restantes > 0 ? indice : indice)}
                    className={
                      "relative rounded-[2px] overflow-hidden focus:outline-none transition-all aspect-[16/10] lg:aspect-auto lg:h-full " +
                      (fotoAtiva === indice ? "ring-2 ring-verde-profundo" : "opacity-85 hover:opacity-100")
                    }
                  >
                    <Foto tone={p.tone + indice} src={g} alt={`${altFoto}, imagem ${indice + 1}`} className="w-full h-full" />
                    {ultima && restantes > 0 && (
                      <span className="absolute inset-0 bg-black/45 text-white flex items-center justify-center text-xs tracking-wider font-sans pointer-events-none">
                        mais {restantes}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Details and Sidebar Contact Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3">
              <h1 className="text-2xl md:text-3xl font-serif text-texto-escuro font-medium leading-tight">
                {p.tipo} com {p.areaUtil},0 m² à venda no bairro {p.bairro}
              </h1>
              <span className="text-xs text-gray-400 tracking-widest font-sans font-medium whitespace-nowrap bg-white border border-[#1a1a1a]/10 px-2.5 py-1 rounded-[2px]">
                Ref: {p.codigo}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-8 font-sans font-light">{p.bairro} · São Paulo</p>

            {/* Metadados / Amenidades */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700 text-sm mb-10 border-y border-[#1a1a1a]/10 py-6 font-sans font-light">
              <div className="flex items-center gap-2.5">
                <Ruler size={18} strokeWidth={1.5} className="text-verde flex-shrink-0" />
                <span>{p.areaUtil} m² úteis</span>
              </div>
              {p.dorms > 0 && (
                <div className="flex items-center gap-2.5">
                  <BedDouble size={18} strokeWidth={1.5} className="text-verde flex-shrink-0" />
                  <span>{p.dorms} dorms ({p.suites} suítes)</span>
                </div>
              )}
              {temBanheiros && (
                <div className="flex items-center gap-2.5">
                  <Bath size={18} strokeWidth={1.5} className="text-verde flex-shrink-0" />
                  <span>{p.banheiros} banheiros</span>
                </div>
              )}
              {p.vagas > 0 && (
                <div className="flex items-center gap-2.5">
                  <Car size={18} strokeWidth={1.5} className="text-verde flex-shrink-0" />
                  <span>{p.vagas} vagas</span>
                </div>
              )}
            </div>

            {/* Sobre o imóvel */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-texto-escuro font-medium">Sobre a propriedade</h2>
              {descricao ? (
                descricao.split("\n").filter(Boolean).map((linha, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-sm sm:text-base font-sans font-light">
                    {linha}
                  </p>
                ))
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-sans font-light">
                  {p.tipo} com {p.areaUtil} m² de área útil no bairro {p.bairro}, em São Paulo
                  {p.dorms > 0 ? `, com ${p.dorms} dormitórios, sendo ${p.suites} suítes` : ""}
                  {p.vagas > 0 ? `, e ${p.vagas} vagas` : ""}.
                  Entre em contato para receber a descrição completa e agendar uma visita.
                </p>
              )}
            </div>

            {/* Detalhes financeiros */}
            {(condominio || iptu || valorM2) && (
              <div className="mt-10">
                <h2 className="text-xl font-serif text-texto-escuro font-medium mb-4">Detalhes</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans font-light">
                  {condominio && (
                    <div className="border border-[#1a1a1a]/10 rounded-[2px] px-4 py-3">
                      <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">Condomínio</dt>
                      <dd className="text-texto-escuro">{fmtPreco(condominio)} por mês</dd>
                    </div>
                  )}
                  {iptu && (
                    <div className="border border-[#1a1a1a]/10 rounded-[2px] px-4 py-3">
                      <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">IPTU</dt>
                      <dd className="text-texto-escuro">{fmtPreco(iptu)} por mês</dd>
                    </div>
                  )}
                  {valorM2 && (
                    <div className="border border-[#1a1a1a]/10 rounded-[2px] px-4 py-3">
                      <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">Valor do m²</dt>
                      <dd className="text-texto-escuro">{fmtPreco(valorM2)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Características Adicionais */}
            {p.caracteristicas && p.caracteristicas.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-serif text-texto-escuro font-medium mb-4">Características do Imóvel</h2>
                <div className="flex gap-2 flex-wrap">
                  {p.caracteristicas.map((c) => (
                    <span
                      key={c}
                      className="px-4 py-2 text-xs border font-sans font-light rounded-[2px] text-verde-profundo border-verde/30 bg-white"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Scheduler Widget */}
          <div className="w-full">
            <div className="border border-gray-200 p-6 sm:p-8 rounded-[2px] bg-white shadow-xs lg:sticky lg:top-28">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1 font-sans font-medium">
                Valor de venda
              </p>
              <p className="text-3xl mb-8 font-serif text-verde font-semibold">
                {typeof p.preco === "number" ? fmtPreco(p.preco) : "Sob consulta"}
              </p>

              {/* Instant Messenger Button */}
              <a
                href={zapMsg}
                target="_blank"
                rel="noreferrer"
                className="btn-verde block text-center w-full py-4 text-xs tracking-widest uppercase font-sans font-semibold mb-4 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
              >
                Agendar via WhatsApp
              </a>

              {/* Real form inside details widget */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-sm font-serif font-medium text-texto-escuro mb-4">Interesse nesta propriedade?</h4>
                {sent ? (
                  <div className="p-4 bg-verde/10 text-texto-escuro border border-verde/20 rounded-[2px] text-xs text-center font-sans">
                    Mensagem de interesse enviada com sucesso! Um consultor entrará em contato.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-[2px] flex items-center gap-2 text-xs font-sans">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    <input
                      type="text"
                      name="nome"
                      required
                      placeholder="Seu Nome *"
                      value={form.nome}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-verde bg-white font-sans text-texto-escuro rounded-[2px]"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Seu E-mail *"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-verde bg-white font-sans text-texto-escuro rounded-[2px]"
                    />
                    <input
                      type="tel"
                      name="tel"
                      placeholder="Seu Telefone"
                      value={form.tel}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-verde bg-white font-sans text-texto-escuro rounded-[2px]"
                    />
                    <textarea
                      name="msg"
                      required
                      rows={3}
                      value={form.msg}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-verde bg-white font-sans text-texto-escuro resize-none rounded-[2px]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-outline-verde w-full py-3 text-xs tracking-wider uppercase font-sans font-medium flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <span>Enviar Proposta</span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-[#1a1a1a]/5 text-center">
                <span className="text-[10px] text-gray-400 font-sans font-light">
                  Lais Camargo · Atendimento Exclusivo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similares Slider / Row */}
        {similares.length > 0 && (
          <div className="mt-20 border-t border-[#1a1a1a]/10 pt-16">
            <h2 className="text-2xl mb-8 font-serif text-texto-escuro font-medium">Imóveis semelhantes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similares.map((x) => (
                <PropertyCard key={x.id} p={x} onOpen={onOpen} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

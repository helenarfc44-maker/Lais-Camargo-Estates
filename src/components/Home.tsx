import React, { useState } from "react";
import { MessageCircle, Mail, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { Imovel } from "../types";
import { PropertyCard } from "./PropertyCard";
import { Foto } from "./Foto";
import { FAQ } from "./FAQ";
import data from "../data/imoveis.json";

const WHATSAPP = "https://wa.me/5511991851032";
const EMAIL = "lais@c5.com.br";

interface HomeProps {
  onNav: (page: string, anchor?: string) => void;
  goSearchTipo: (tipos: string[]) => void;
  onOpen: (p: Imovel) => void;
}

export function Home({ onNav, goSearchTipo, onOpen }: HomeProps) {
  const IMOVEIS: Imovel[] = data.imoveis;
  const destaques = IMOVEIS.filter((p) => p.exclusivo).slice(0, 3);

  // Form State
  const [form, setForm] = useState({ nome: "", email: "", tel: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.msg) {
      setError("Por favor, preencha todos os campos obrigatórios (Nome, E-mail e Mensagem).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSent(true);
        setForm({ nome: "", email: "", tel: "", msg: "" });
      } else {
        setError(result.message || "Infelizmente ocorreu um erro. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao enviar contato:", err);
      setError("Erro de rede. Verifique se o servidor está ativo.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoria = (label: string, tipos: string[], img: string) => (
    <button
      onClick={() => goSearchTipo(tipos)}
      className="group relative overflow-hidden h-[500px] md:h-[650px] w-full flex flex-col items-center justify-center cursor-pointer focus:outline-none"
    >
      <img 
        src={img} 
        alt={label} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center transform group-hover:-translate-y-2 transition-transform duration-500">
        <h3 className="text-white text-3xl md:text-4xl lg:text-5xl mb-6 font-serif font-medium tracking-wide">{label}</h3>
        <div className="border border-white/80 text-white px-8 py-3 text-sm tracking-[0.2em] uppercase font-sans font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Ver imóveis
        </div>
      </div>
    </button>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Lais Camargo Estates",
            "url": "https://www.laiscamargoestates.com.br/",
            "priceRange": "$$$$",
            "areaServed": [
              {
                "@type": "AdministrativeArea",
                "name": "Itaim Bibi",
                "sameAs": "https://pt.wikipedia.org/wiki/Itaim_Bibi"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Jardins",
                "sameAs": "https://pt.wikipedia.org/wiki/Jardins_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Vila Nova Conceição",
                "sameAs": "https://pt.wikipedia.org/wiki/Vila_Nova_Concei%C3%A7%C3%A3o"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Jardim América",
                "sameAs": "https://pt.wikipedia.org/wiki/Jardim_Am%C3%A9rica_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Pinheiros",
                "sameAs": "https://pt.wikipedia.org/wiki/Pinheiros_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Cidade Jardim",
                "sameAs": "https://pt.wikipedia.org/wiki/Cidade_Jardim_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Jardim Europa",
                "sameAs": "https://pt.wikipedia.org/wiki/Jardim_Europa_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Jardim Paulistano",
                "sameAs": "https://pt.wikipedia.org/wiki/Jardim_Paulistano_(bairro_de_S%C3%A3o_Paulo)"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Morumbi",
                "sameAs": "https://pt.wikipedia.org/wiki/Morumbi_(bairro_de_S%C3%A3o_Paulo)"
              }
            ]
          })
        }}
      />
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Imóvel de Luxo Lais Camargo Estates"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl mt-12">
          {/* H1 Principal com SEO Otimizado */}
<h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-widest mb-2">
  <span className="block">LAIS CAMARGO</span>
  <span className="block text-sm md:text-base tracking-[0.85em] pl-[0.85em] font-sans font-normal uppercase mt-2 drop-shadow-md">
    ESTATES
  </span>
</h1>

{/* Filete separador */}
<div className="w-[190px] h-px bg-white/40 my-6" />

{/* Subtítulos */}
<p className="text-white text-xs md:text-sm tracking-[0.3em] font-sans font-medium uppercase max-w-2xl text-center drop-shadow-md">
  Curadoria de imóveis de altíssimo padrão em São Paulo
</p>
<p className="text-white text-[10px] md:text-xs tracking-[0.4em] font-sans font-medium uppercase mt-2 mb-8 drop-shadow-md">
  Mais de 25 anos de expertise
</p>
          
          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            {/* Botão Sólido Branco para Destaque */}
            <button
              onClick={() => onNav("search")}
              className="bg-white hover:bg-gray-100 text-gray-900 w-full sm:w-52 py-3.5 text-[13px] tracking-[0.2em] uppercase font-sans font-semibold transition-all duration-300 shadow-lg"
            >
              Ver Imóveis
            </button>

            {/* Botão Outline */}
            <button
              onClick={() => onNav("home", "#contato")}
              className="border border-white hover:bg-white hover:text-black text-white w-full sm:w-52 py-3.5 text-[13px] tracking-[0.2em] uppercase font-sans font-medium transition-colors duration-300 bg-black/30"
            >
              Contato
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator com Seta */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 text-[10px] tracking-widest uppercase font-sans font-light animate-bounce hidden sm:flex cursor-pointer" onClick={() => onNav("home", "#destaques")}>
          <span className="mb-1">Role para ver mais</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* PROPERTIES HIGHLIGHTS */}
      <section id="destaques" className="max-w-7xl mx-auto px-5 py-20 md:py-28">
        <p className="text-center text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-3 font-sans text-verde-profundo font-medium">
          Seleção criteriosa
        </p>
        <h2 className="text-center text-3xl md:text-4xl mb-16 font-serif text-texto-escuro font-medium">
          Imóveis em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destaques.map((p) => (
            <PropertyCard key={p.id} p={p} onOpen={onOpen} />
          ))}
        </div>
        <div className="text-center mt-16">
          <button
            onClick={() => onNav("search")}
            className="btn-outline-verde px-10 py-4.5 text-xs tracking-[0.25em] uppercase font-sans font-medium"
          >
            Ver todos os imóveis
          </button>
        </div>
      </section>

      {/* CATEGORIES SECTIONS */}
      <section className="w-full pb-0 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {categoria("Casas", ["Casa", "Casa de condomínio"], "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80")}
          {categoria("Apartamentos", ["Apartamento"], "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80")}
          {categoria("Coberturas", ["Cobertura"], "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80")}
        </div>
      </section>

      {/* SOBRE (BIO) */}
      <section id="sobre" className="text-white py-24 md:py-28 bg-verde-profundo">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-4 opacity-70 font-sans font-medium">
              Quem Somos
            </p>
            <h2 className="text-3xl md:text-4xl mb-8 font-serif font-medium tracking-wide">
              Lais Camargo
            </h2>
            <div className="space-y-5 leading-relaxed text-sm sm:text-base opacity-90 font-sans font-light">
              <p>
                Com mais de 25 anos de atuação consolidada no mercado imobiliário de alto padrão, Lais Camargo construiu uma reputação impecável pautada em dedicação, discrição absoluta e um conhecimento cirúrgico das áreas residenciais mais nobres e desejadas de São Paulo.
              </p>
              <p>
                Especialista de referência em bairros como os Jardins, Cidade Jardim, Itaim Bibi e Vila Nova Conceição, ela lidera uma equipe altamente qualificada para apresentar um portfólio restrito e criteriosamente selecionado, garantindo uma curadoria de luxo real.
              </p>
              <p>
                O atendimento é desenhado individualmente para cada cliente, focado na otimização de tempo, na segurança das transações e no refinamento estético que apenas propriedades extraordinárias possuem.
              </p>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-branco inline-block mt-10 px-10 py-4 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Fale com a equipe
            </a>
          </div>
          <div className="w-full">
           <Foto
  tone={4}
  src="/lais-camargo.jpg"
  alt="Lais Camargo, corretora especializada em imóveis de alto padrão em São Paulo"
  className="aspect-[4/5] w-full rounded-sm shadow-lg object-cover"
>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white text-xs tracking-[0.3em] uppercase font-sans font-medium">
                Lais Camargo
              </div>
            </Foto>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQ />

      {/* CONTATO SECTION */}
      <section id="contato" className="max-w-7xl mx-auto px-5 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Information Column */}
          <div>
            <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-4 font-sans text-verde-profundo font-medium">
              Contato
            </p>
            <h2 className="text-3xl md:text-4xl mb-8 font-serif text-texto-escuro font-medium">
              Agende um Atendimento
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed text-sm sm:text-base font-sans font-light">
              Estamos disponíveis para atendimentos presenciais com agendamento prévio. Entre em contato para conhecer oportunidades sob medida ou solicitar a avaliação de sua propriedade com discrição e rigor técnico.
            </p>
            <div className="space-y-6">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 hover:opacity-70 transition-opacity text-texto-escuro font-sans"
              >
                <div className="p-3 bg-verde/10 rounded-full">
                  <MessageCircle size={20} strokeWidth={1.5} className="text-verde-profundo" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-sans font-medium uppercase tracking-wider">WhatsApp</p>
                  <p className="text-sm font-semibold">(11) 99185-1032</p>
                </div>
              </a>
              <a
                href={"mailto:" + EMAIL}
                className="flex items-center gap-4 hover:opacity-70 transition-opacity text-texto-escuro font-sans"
              >
                <div className="p-3 bg-verde/10 rounded-full">
                  <Mail size={20} strokeWidth={1.5} className="text-verde-profundo" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-sans font-medium uppercase tracking-wider">E-mail Corporativo</p>
                  <p className="text-sm font-semibold">{EMAIL}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div>
            {sent ? (
              <div className="border border-verde p-10 text-center bg-verde/5 flex flex-col items-center justify-center h-full rounded-sm">
                <h3 className="text-2xl mb-3 font-serif text-texto-escuro">Mensagem Enviada</h3>
                <p className="text-gray-500 text-sm mb-6 font-sans font-light max-w-sm">
                  Agradecemos seu contato. Um consultor de nossa equipe altamente especializada entrará em contato em breve para lhe dar atendimento exclusivo.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-outline-verde px-6 py-3 text-xs tracking-widest uppercase font-sans font-medium"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-sm flex items-center gap-3 text-sm font-sans">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div>
                  <label htmlFor="nome" className="sr-only">Nome Completo</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    placeholder="Nome Completo *"
                    value={form.nome}
                    onChange={handleInputChange}
                    className="input-verde w-full border border-gray-300 px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:border-verde-profundo transition-colors bg-white font-sans text-texto-escuro"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">E-mail de Contato</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="E-mail de Contato *"
                    value={form.email}
                    onChange={handleInputChange}
                    className="input-verde w-full border border-gray-300 px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:border-verde-profundo transition-colors bg-white font-sans text-texto-escuro"
                  />
                </div>

                <div>
                  <label htmlFor="tel" className="sr-only">Telefone / Celular</label>
                  <input
                    id="tel"
                    name="tel"
                    type="tel"
                    placeholder="Telefone / Celular (opcional)"
                    value={form.tel}
                    onChange={handleInputChange}
                    className="input-verde w-full border border-gray-300 px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:border-verde-profundo transition-colors bg-white font-sans text-texto-escuro"
                  />
                </div>

                <div>
                  <label htmlFor="msg" className="sr-only">Sua Mensagem</label>
                  <textarea
                    id="msg"
                    name="msg"
                    required
                    placeholder="Como podemos ajudar você? *"
                    rows={5}
                    value={form.msg}
                    onChange={handleInputChange}
                    className="input-verde w-full border border-gray-300 px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:border-verde-profundo transition-colors bg-white resize-none font-sans text-texto-escuro"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-verde w-full py-4.5 text-xs tracking-[0.25em] uppercase font-sans font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar Mensagem</span>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center font-sans font-light mt-4">
                  Seus dados estão protegidos sob nossa política estrita de confidencialidade de alto padrão.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import React, { useState } from "react";
import { MessageCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import { Imovel } from "../types";
import { PropertyCard } from "./PropertyCard";
import { Foto } from "./Foto";
import { LaisLogo } from "./LaisLogo";
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

  const categoria = (label: string, tipos: string[], tone: number, img: string) => (
    <button
      onClick={() => goSearchTipo(tipos)}
      className="group relative overflow-hidden aspect-[3/4] md:aspect-[4/5] w-full text-left cursor-pointer focus:outline-none"
    >
      <Foto tone={tone} src={img} zoom className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="text-white text-2xl mb-2 font-serif font-medium tracking-wide">{label}</h3>
        <span
          className="text-white text-xs tracking-[0.25em] uppercase border-b border-white/40 pb-1 opacity-80 group-hover:opacity-100 transition-opacity font-sans font-light"
        >
          Ver imóveis
        </span>
      </div>
    </button>
  );

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Foto
          tone={0}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-texto-escuro/60" />
        <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl">
          <LaisLogo className="w-56 sm:w-72 md:w-96 mb-8 animate-fadeIn text-white" />
          <p
            className="text-white text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mb-12 opacity-90 font-sans font-light"
          >
            Curadoria de imóveis de altíssimo padrão em São Paulo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            <button
              onClick={() => onNav("search")}
              className="btn-verde w-full sm:w-auto px-10 py-4.5 text-[11px] tracking-[0.25em] uppercase font-sans font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              Ver Portfólio
            </button>
            <button
              onClick={() => onNav("home", "#contato")}
              className="btn-outline-branco w-full sm:w-auto px-10 py-4.5 text-[11px] tracking-[0.25em] uppercase font-sans font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              Falar com equipe
            </button>
          </div>
        </div>
        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] tracking-widest uppercase font-sans font-light animate-bounce hidden sm:block">
          Role para ver mais
        </div>
      </section>

      {/* PROPERTIES HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-5 py-20 md:py-28">
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
      <section className="max-w-7xl mx-auto px-5 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoria("Casas Luxuosas", ["Casa", "Casa de condomínio"], 5, "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80")}
          {categoria("Apartamentos Premium", ["Apartamento"], 2, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80")}
          {categoria("Coberturas Exclusivas", ["Cobertura"], 7, "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80")}
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
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80"
              className="aspect-[4/5] w-full rounded-sm shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white text-xs tracking-[0.3em] uppercase font-sans font-medium">
                Lais Camargo
              </div>
            </Foto>
          </div>
        </div>
      </section>

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

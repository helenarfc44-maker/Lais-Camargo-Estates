import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    q: "Em quais regiões de São Paulo a Lais Camargo Estates atua?",
    a: "Atuamos com foco em imóveis de alto padrão nos bairros Jardins, Itaim Bibi, Cidade Jardim e Alto de Pinheiros."
  },
  {
    q: "O que significa a curadoria de imóveis?",
    a: "Diferente de portais com milhares de anúncios, trabalhamos com uma seleção criteriosa. Cada imóvel do nosso portfólio é avaliado pessoalmente — localização, padrão construtivo, documentação e potencial de valorização — antes de ser apresentado aos nossos clientes."
  },
  {
    q: "Vocês trabalham com imóveis fora do mercado (off-market)?",
    a: "Sim. Boa parte das oportunidades de altíssimo padrão não chega aos portais. Com mais de 25 anos de relacionamento no mercado paulistano, temos acesso a imóveis exclusivos apresentados apenas a compradores qualificados."
  },
  {
    q: "Como funciona o processo de compra de um imóvel de alto padrão?",
    a: "Acompanhamos todas as etapas: entendimento do perfil e necessidades, seleção e visitas, negociação, análise documental e assessoria até a escritura."
  },
  {
    q: "Vocês também atendem quem quer vender um imóvel?",
    a: "Sim. Fazemos avaliação criteriosa, preparação do imóvel para apresentação e divulgação estratégica e discreta para uma carteira qualificada de compradores."
  },
  {
    q: "Qual o diferencial de trabalhar com a Lais Camargo?",
    a: "São mais de 25 anos de expertise no mercado imobiliário de alto padrão de São Paulo, com atendimento pessoal e direto — você trata com quem decide, do primeiro contato à assinatura."
  },
  {
    q: "O atendimento é sigiloso?",
    a: "Sim. Discrição é premissa do nosso trabalho, tanto para proprietários quanto para compradores. Visitas são agendadas individualmente e informações são tratadas com confidencialidade."
  },
  {
    q: "Como agendar uma visita ou conversa?",
    a: "Pelo formulário do site ou diretamente pelo WhatsApp +55 11 99422-8788.",
    link: "https://wa.me/5511994228788"
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 font-serif text-texto-escuro font-medium">Perguntas Frequentes</h2>
          <p className="text-texto-escuro/60 font-sans font-light">Tudo o que você precisa saber sobre nosso trabalho</p>
        </div>

        <div className="flex flex-col border-t border-texto-escuro/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-texto-escuro/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <h3 className="font-sans font-medium text-texto-escuro/90 pr-8">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 text-texto-escuro/50 group-hover:text-texto-escuro/80 transition-colors"
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-12 font-sans font-light text-texto-escuro/70 leading-relaxed text-sm md:text-base">
                        {faq.link ? (
                          <>
                            Pelo formulário do site ou diretamente pelo WhatsApp{" "}
                            <a
                              href={faq.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-4 decoration-texto-escuro/30 hover:decoration-texto-escuro/80 transition-colors"
                            >
                              +55 11 99422-8788
                            </a>
                            .
                          </>
                        ) : (
                          faq.a
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const getImoveisData = () => {
    try {
      const dataPath = path.join(process.cwd(), "src", "data", "imoveis.json");
      return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    } catch (e) {
      return { imoveis: [] };
    }
  };

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // API Route: Dynamic Sitemap
  app.get("/sitemap.xml", (req, res) => {
    const data = getImoveisData();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    xml += `  <url>\n    <loc>https://www.laiscamargoestates.com.br/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.laiscamargoestates.com.br/busca</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    for (const p of data.imoveis) {
      const slug = slugify(p.tipo + " com " + p.areaUtil + "-0 m2 a venda no bairro " + p.bairro) + "-" + p.codigo;
      xml += `  <url>\n    <loc>https://www.laiscamargoestates.com.br/imovel/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
    
    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  app.post("/api/contact", (req, res) => {
    const { nome, email, tel, msg, codigoImovel } = req.body;
    if (!nome || !email || !msg) {
      return res.status(400).json({ success: false, message: "Por favor, preencha todos os campos obrigatórios." });
    }
    return res.status(200).json({ success: true, message: "Mensagem recebida com sucesso!" });
  });

  app.get("/api/imoveis", (req, res) => {
    return res.json(getImoveisData());
  });

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Use custom so we can intercept index.html
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Serve static files except index.html
    app.use(express.static(distPath, { index: false }));
  }

  // Fallback route for SPA and OG tag injection
  app.get("*", async (req, res, next) => {
    try {
      let html = '';
      if (process.env.NODE_ENV !== "production") {
        html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(req.url, html);
      } else {
        html = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf-8");
      }

      const data = getImoveisData();
      let geoHtml = "";

      // Inject OG Tags and GEO Content if it's a property detail page
      if (req.path.startsWith('/imovel/')) {
        const slug = req.path.split('/')[2];
        const p = data.imoveis.find((x: any) => {
          return slugify(x.tipo + " com " + x.areaUtil + "-0 m2 a venda no bairro " + x.bairro) + "-" + x.codigo === slug;
        });

        if (p) {
          const title = `${p.tipo} no ${p.bairro} | Lais Camargo`;
          const description = `Excelente ${p.tipo.toLowerCase()} com ${p.areaUtil}m², ${p.dorms} dormitórios (${p.suites} suítes) e ${p.vagas} vagas à venda no bairro ${p.bairro}, São Paulo.`;
          const image = p.img;

          html = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
          html = html.replace(/<meta name="description" content="(.*?)"\s*\/>/, `<meta name="description" content="${description}" />`);
          html = html.replace(/<meta property="og:title" content="(.*?)"\s*\/>/, `<meta property="og:title" content="${title}" />`);
          html = html.replace(/<meta property="og:description" content="(.*?)"\s*\/>/, `<meta property="og:description" content="${description}" />`);
          html = html.replace(/<meta property="og:image" content="(.*?)"\s*\/>/, `<meta property="og:image" content="${image}" />`);

          // GEO Payload for Property
          geoHtml = `
            <noscript>
              <article>
                <h1>${p.tipo} à venda no ${p.bairro}, São Paulo - Ref: ${p.codigo}</h1>
                <p>${description}</p>
                <ul>
                  <li><strong>Área Útil:</strong> ${p.areaUtil} m²</li>
                  <li><strong>Dormitórios:</strong> ${p.dorms} (${p.suites} suítes)</li>
                  <li><strong>Banheiros:</strong> ${p.banheiros}</li>
                  <li><strong>Vagas:</strong> ${p.vagas}</li>
                  <li><strong>Preço:</strong> R$ ${new Intl.NumberFormat('pt-BR').format(p.preco)}</li>
                </ul>
                <h2>Características</h2>
                <ul>
                  ${p.caracteristicas.map((c: string) => `<li>${c}</li>`).join("")}
                </ul>
              </article>
            </noscript>
          `;
        }
      } else {
        // GEO Payload for Home/Search (Generative Engine Optimization)
        geoHtml = `
          <noscript>
            <main>
              <h1>Lais Camargo Estates - Curadoria de Imóveis de Alto Padrão em São Paulo</h1>
              <section>
                <h2>Sobre Lais Camargo</h2>
                <p>Com mais de 25 anos de atuação consolidada no mercado imobiliário de alto padrão, Lais Camargo (CRECI 76056) construiu uma reputação pautada em dedicação e discrição. Especialista de referência em bairros como Jardins, Cidade Jardim, Itaim Bibi e Vila Nova Conceição.</p>
              </section>
              <section>
                <h2>Perguntas Frequentes sobre nossa Curadoria</h2>
                <dl>
                  <dt>Em quais regiões de São Paulo a Lais Camargo Estates atua?</dt>
                  <dd>Atuamos com foco em imóveis de alto padrão nos bairros Jardins, Itaim Bibi, Cidade Jardim e Alto de Pinheiros.</dd>
                  <dt>O que significa a curadoria de imóveis?</dt>
                  <dd>Cada imóvel do nosso portfólio é avaliado pessoalmente — localização, padrão construtivo, documentação e potencial de valorização.</dd>
                  <dt>Vocês trabalham com imóveis off-market?</dt>
                  <dd>Sim. Com mais de 25 anos de relacionamento, temos acesso a imóveis exclusivos apresentados apenas a compradores qualificados.</dd>
                  <dt>Qual o diferencial de trabalhar com a Lais Camargo?</dt>
                  <dd>Atendimento pessoal e direto — você trata com quem decide, do primeiro contato à assinatura.</dd>
                </dl>
              </section>
              <section>
                <h2>Imóveis de Alto Padrão Disponíveis</h2>
                <ul>
                  ${data.imoveis.map((p: any) => {
                    const slug = slugify(p.tipo + " com " + p.areaUtil + "-0 m2 a venda no bairro " + p.bairro) + "-" + p.codigo;
                    return `<li><a href="https://www.laiscamargoestates.com.br/imovel/${slug}">${p.tipo} em ${p.bairro} - ${p.areaUtil}m², ${p.dorms} quartos. Preço: R$ ${new Intl.NumberFormat('pt-BR').format(p.preco)} (Ref: ${p.codigo})</a></li>`;
                  }).join("")}
                </ul>
              </section>
            </main>
          </noscript>
        `;
      }

      // Inject GEO SSR Content into the HTML body
      if (geoHtml) {
        html = html.replace('<body>', `<body>\n    ${geoHtml}`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      res.status(500).send(e.message);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
});

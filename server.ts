import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // API Route: Contact Form Submission
  app.post("/api/contact", (req, res) => {
    const { nome, email, tel, msg, codigoImovel } = req.body;

    // Validate request
    if (!nome || !email || !msg) {
      return res.status(400).json({ 
        success: false, 
        message: "Por favor, preencha todos os campos obrigatórios (nome, e-mail, mensagem)." 
      });
    }

    console.log("=== NOVA MENSAGEM DE CONTATO ===");
    console.log(`Nome: ${nome}`);
    console.log(`E-mail: ${email}`);
    console.log(`Telefone: ${tel || "Não informado"}`);
    console.log(`Mensagem: ${msg}`);
    if (codigoImovel) {
      console.log(`Imóvel de Interesse: ${codigoImovel}`);
    }
    console.log("================================");

    // In a production application, you would send an email (e.g. Nodemailer, SendGrid, etc.) or save to a database.
    return res.status(200).json({ 
      success: true, 
      message: "Mensagem recebida com sucesso! Nossa equipe entrará em contato em breve." 
    });
  });

  // API Route: Get Properties JSON (to demonstrate dynamic fetch)
  app.get("/api/imoveis", (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "src", "data", "imoveis.json");
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      return res.json(JSON.parse(fileContent));
    } catch (error) {
      console.error("Erro ao ler dados dos imóveis:", error);
      return res.status(500).json({ error: "Erro interno ao ler os imóveis." });
    }
  });

  // Vite middleware for development / Static files serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
});

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// 1. Carrega as variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config();

console.log("--- Iniciando script de setup de credenciais ---");

// 2. Pega o conteúdo JSON da variável de ambiente (agora carregada do .env)
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;

// Define o caminho do arquivo de credenciais.
// process.cwd() garante que o arquivo seja criado na raiz do projeto.
const credentialsFilePath = path.join(process.cwd(), "gemini.env.json");

// Verifica se a variável com as credenciais em JSON foi fornecida.
if (credentialsJsonString) {
  try {
    console.log(`Criando arquivo de credenciais em: ${credentialsFilePath}`);

    // Cria o arquivo JSON com o conteúdo da variável de ambiente.
    fs.writeFileSync(credentialsFilePath, credentialsJsonString);

    console.log("✅ Arquivo de credenciais criado com sucesso.");
  } catch (error) {
    console.error("❌ Erro fatal ao criar o arquivo de credenciais:", error);
    // Encerra o processo com erro se não for possível criar o arquivo.
    process.exit(1);
  }
} else {
  // Apenas avisa, pois em ambiente de produção (Vercel) a variável virá do painel.
  console.warn(
    "⚠️ AVISO: A variável GOOGLE_CREDENTIALS_JSON não foi encontrada no ambiente ou no arquivo .env."
  );
}

console.log("--- Script de setup de credenciais finalizado ---");

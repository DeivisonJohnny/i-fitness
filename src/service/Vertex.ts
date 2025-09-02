import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = process.env.GEMINI_PROJECT_ID;
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.0-flash-001";

if (!PROJECT_ID) {
  throw new Error(
    "A variável de ambiente GEMINI_PROJECT_ID não está definida."
  );
}

// Pega a string JSON diretamente da variável de ambiente.
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;

if (!credentialsJsonString) {
  throw new Error(
    "A variável de ambiente GOOGLE_CREDENTIALS_JSON não está definida no ambiente de execução."
  );
}

// Converte a string JSON em um objeto de credenciais.
const credentials = JSON.parse(credentialsJsonString);

// Inicializa o VertexAI passando as credenciais diretamente.
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  // A correção é passar as credenciais dentro do objeto googleAuthOptions
  googleAuthOptions: {
    credentials,
  },
});

export const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_NAME,
});

console.log(
  "Modelo generativo inicializado com sucesso usando credenciais diretas!"
);

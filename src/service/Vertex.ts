import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = process.env.GEMINI_PROJECT_ID;
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.0-flash-001";

if (!PROJECT_ID) {
  throw new Error(
    "A variável de ambiente GEMINI_PROJECT_ID não está definida."
  );
}

const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

export const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL_NAME,
});

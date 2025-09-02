import multer from "multer";

// Não precisamos mais de 'path', 'os' ou 'fs' aqui!

const CONFIG = {
  // Use memoryStorage para manter o arquivo na memória como um buffer
  storage: multer.memoryStorage(),
  limits: {
    // Opcional: defina um limite de tamanho para os arquivos
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};

export function file(field = "file") {
  return multer(CONFIG).single(field);
}

export function files(field = "files") {
  return multer(CONFIG).array(field);
}

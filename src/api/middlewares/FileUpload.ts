import Util from "@/utils/Util";
import multer from "multer";
import path from "path"; // 1. Importar os módulos 'path'
import os from "os"; //    e 'os'
import fs from "fs"; //    e 'fs'

// 2. Definir o caminho do diretório de upload dentro da pasta temporária
const uploadDir = path.join(os.tmpdir(), "meals-uploads");

// 3. Garantir que o diretório de destino exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const CONFIG = {
  storage: multer.diskStorage({
    // 4. Usar o caminho do diretório temporário como destino
    destination: uploadDir,
    filename: (req, file, callback) => {
      callback(null, `${Util.uuid()}${Util.getExtName(file.originalname)}`);
    },
  }),
};

export function file(field = "file") {
  return multer(CONFIG).single(field);
}

export function files(field = "files") {
  return multer(CONFIG).array(field);
}

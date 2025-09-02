import multer from "multer";

const CONFIG = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

export function file(field = "file") {
  return multer(CONFIG).single(field);
}

export function files(field = "files") {
  return multer(CONFIG).array(field);
}

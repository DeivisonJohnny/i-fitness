import Util from "@/utils/Util";
import multer from "multer";

const CONFIG = {
  storage: multer.diskStorage({
    destination: "../meals-uploads",
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

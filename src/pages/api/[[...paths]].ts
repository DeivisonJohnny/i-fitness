import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import routes from "@/api/routes";
import ApiError from "@/utils/ApiError";

const api = nc<NextApiRequest, NextApiResponse>({
  attachParams: true,
  onNoMatch: (req, res) => {
    res.status(404).end();
  },
  onError: (error, req, res) => {
    let status = 500;
    let message = "Ocorreu um erro, tente novamente!";
    let cause: string = "Erro indefinido";

    if (error instanceof ApiError) {
      status = error.status;
      message = error.message;
    }
    cause = error.message;

    res.status(status).json({ message, cause });
  },
});

export const config = { api: { bodyParser: false } };

export default api.use("/api", routes(api));

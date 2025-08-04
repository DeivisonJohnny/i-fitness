import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect } from "next-connect";
import UserController from "./controllers/UserController";
import bodyParser from "./middlewares/BodyParser";

export default function routes(
  api: NextConnect<NextApiRequest, NextApiResponse>
) {
  api.use(bodyParser);

  api.post("/user", UserController.createUser);

  return api;
}

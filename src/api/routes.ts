import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect } from "next-connect";
import UserController from "./controllers/UserController";
import bodyParser from "./middlewares/BodyParser";
import auth from "./middlewares/Auth";

export default function routes(
  api: NextConnect<NextApiRequest, NextApiResponse>
) {
  api.use(bodyParser);

  api.post("/user", UserController.createUser);
  api.post("/user/me", auth(), UserController.authMe);
  api.put("/user", auth(), UserController.updateUser);

  return api;
}

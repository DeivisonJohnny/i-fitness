import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect } from "next-connect";
import UserController from "./controllers/UserController";
import bodyParser from "./middlewares/BodyParser";
import auth from "./middlewares/Auth";
import { PhysicalAssessmentController } from "./controllers/PhysicalAssessmentController";
import MealsController from "./controllers/MealsController";

export default function routes(
  api: NextConnect<NextApiRequest, NextApiResponse>
) {
  api.use(bodyParser);

  api.post("/user", UserController.createUser);
  api.post("/user/me", auth(), UserController.findMe);
  api.put("/user", auth(), UserController.updateUser);
  api.post("/user/auth", UserController.auth);

  api.post(
    "/assessment",
    auth(),
    PhysicalAssessmentController.createPhysicalAssessment
  );

  api.post("/meal", auth(), MealsController.createMeal);

  return api;
}

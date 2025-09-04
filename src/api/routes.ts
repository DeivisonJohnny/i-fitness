import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect } from "next-connect";
import UserController from "./controllers/UserController";
import bodyParser from "./middlewares/BodyParser";
import auth from "./middlewares/Auth";
import { PhysicalAssessmentController } from "./controllers/PhysicalAssessmentController";
import MealsController from "./controllers/MealsController";
import { file } from "./middlewares/FileUpload";
import { AttachmentController } from "./controllers/AttachmentController";
import { GoogleController } from "./controllers/GoogleController";

export default function routes(
  api: NextConnect<NextApiRequest, NextApiResponse>
) {
  api.use(bodyParser);

  api.post("/user", UserController.createUser);
  api.post("/user/me", auth(), UserController.findMe);
  api.put("/user", auth(), UserController.updateUser);
  api.post("/user/auth", UserController.auth);

  api.post("/auth/google", GoogleController.authGoogle);

  api.post(
    "/assessment",
    auth(),
    PhysicalAssessmentController.createPhysicalAssessment
  );

  api.post("/meal", auth(), MealsController.createMeal);
  api.get("/meal", auth(), MealsController.list);
  api.get("/meal/today", auth(), MealsController.findMealsToday);
  api.get("/meal/calories", auth(), MealsController.findWeeklyCalories);

  api.post("attachments", auth(), file(), AttachmentController.create);

  return api;
}

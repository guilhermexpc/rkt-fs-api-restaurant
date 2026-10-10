import { Router } from "express";
import { RestTableSessionController } from "@/controllers/rest-tables-sessions-controller";

const restTableSessionsRouter = Router();
const restTableSessionController = new RestTableSessionController();

restTableSessionsRouter.get("/", restTableSessionController.index);
restTableSessionsRouter.post("/", restTableSessionController.create);
restTableSessionsRouter.patch("/:id", restTableSessionController.update);
export { restTableSessionsRouter };

import { Router } from "express";
import { RestTableSessionController } from "@/controllers/rest-table-sessions-controller";

const restTableSessionsRouter = Router();
const restTableSessionController = new RestTableSessionController();

restTableSessionsRouter.post("/", restTableSessionController.create);
export { restTableSessionsRouter };

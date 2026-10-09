import { Router } from "express";
import { RestaurantTablesController } from "@/controllers/restaurant-tables-controller";

const restaurantTablesRouter = Router();
const restaurantTablesController = new RestaurantTablesController();

restaurantTablesRouter.get("/", restaurantTablesController.index);

export { restaurantTablesRouter };

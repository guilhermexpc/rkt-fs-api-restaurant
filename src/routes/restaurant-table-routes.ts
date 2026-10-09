import { RestaurantTablesController } from "@/controllers/restaurant-tables-controller";
import { Router } from "express";

const restaurantTablesRouter = Router();
const restaurantTablesController = new RestaurantTablesController();

restaurantTablesRouter.get("/", restaurantTablesController.index);

export { restaurantTablesRouter };

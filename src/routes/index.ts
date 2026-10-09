import { Router } from "express";

import { productsRoutes } from "./products-routes";
import { restaurantTablesRouter } from "./restaurant-table-routes";

const routes = Router();
// setup all routes
routes.use("/products", productsRoutes);
routes.use("/restaurant-tables", restaurantTablesRouter);

export { routes };

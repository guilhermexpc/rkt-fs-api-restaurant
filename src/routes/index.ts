import { Router } from "express";

import { productsRoutes } from "./products-routes";
import { restaurantTablesRouter } from "./restaurant-table-routes";
import { restTableSessionsRouter } from "./rest-table-sessions-routes";

const routes = Router();
// setup all routes
routes.use("/products", productsRoutes);
routes.use("/restaurant-tables", restaurantTablesRouter);
routes.use("/rest-table-sessions", restTableSessionsRouter);

export { routes };

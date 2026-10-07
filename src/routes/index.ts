import { Router } from "express";

import { productsRoutes } from "./products-routes";

const routes = Router();
// setup all routes
routes.use("/products", productsRoutes);

export { routes };

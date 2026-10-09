import { Request, Response, NextFunction } from "express";
import { knexConnection } from "@/database/knex";

class RestaurantTablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knexConnection<TableRepository>("restaurant_tables").orderBy("table_number");
      response.json(tables);
    } catch (error) {
      next(error);
    }
  }
}

export { RestaurantTablesController };

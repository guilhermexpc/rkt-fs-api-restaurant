import { Request, Response, NextFunction } from "express";
import { knexConnection } from "@/database/knex";

import { TABLES } from "@/database/tables-config";

class RestaurantTablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knexConnection<TableRepository>(TABLES.restaurantTables).orderBy("table_number");
      response.json(tables);
    } catch (error) {
      next(error);
    }
  }
}

export { RestaurantTablesController };

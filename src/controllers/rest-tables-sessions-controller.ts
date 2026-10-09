import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { knexConnection } from "@/database/knex";

class RestTableSessionController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // // Define the schema for the request body using Zod
      const bodySchema = z.object({
        table_id: z.number()
      });

      // // Validate the request body against the schema
      const { table_id } = bodySchema.parse(request.body);

      await knexConnection<RestTablesSessionRepository>("rest_tables_sessions").insert({
        table_id,
        opened_at: knexConnection.fn.now()
      });

      response.status(201).json({ message: "RestTableSession created successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { RestTableSessionController };

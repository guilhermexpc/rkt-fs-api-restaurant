import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { knexConnection } from "@/database/knex";
import { AppError } from "@/utils/AppError";

const sessionsIdSchema = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), { message: "Id must be a number" });

class RestTableSessionController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // // Define the schema for the request body using Zod
      const bodySchema = z.object({
        table_id: z.number()
      });

      // // Validate the request body against the schema
      const { table_id } = bodySchema.parse(request.body);

      const sessionExists = await knexConnection<RestTablesSessionRepository>("rest_tables_sessions")
        .where({ table_id, closed_at: null })
        .first();

      if (sessionExists && !sessionExists.closed_at) {
        throw new AppError("This table is already  open", 400);
      }

      await knexConnection<RestTablesSessionRepository>("rest_tables_sessions").insert({
        table_id,
        opened_at: knexConnection.fn.now()
      });

      response.status(201).json({ message: "RestTableSession created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knexConnection<RestTablesSessionRepository>("rest_tables_sessions")
        .select("id", "table_id", "opened_at", "closed_at")
        .orderBy("closed_at", "asc");

      return response.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = sessionsIdSchema.parse(request.params.id);

      const session = await knexConnection<RestTablesSessionRepository>("rest_tables_sessions").where({ id }).first();

      if (!session) {
        throw new AppError("Session table was not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("This session table is already closed", 400);
      }

      await knexConnection<RestTablesSessionRepository>("rest_tables_sessions")
        .update({
          closed_at: knexConnection.fn.now()
        })
        .where({ id });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { RestTableSessionController };

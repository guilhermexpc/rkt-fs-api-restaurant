import { Request, Response, NextFunction } from "express";
import { knexConnection } from "@/database/knex";

class RestTableSessionController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      response.status(201).json({ message: "RestTableSession created successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { RestTableSessionController };

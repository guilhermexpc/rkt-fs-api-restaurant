import { NextFunction, Request, Response } from "express";
import { knexConnection } from "@/database/knex";
import { z } from "zod";

import { AppError } from "@/utils/AppError.js";

class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // throw new AppError("This is a custom error", 400);
      return response.json({ message: "Products index" });
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number({ required_error: "Price is required" }).gt(0, { message: "Price must be greater than 0" })
      });

      const { name, price } = bodySchema.parse(request.body);

      await knexConnection<ProductRepository>("products").insert({ name, price });

      return response.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };

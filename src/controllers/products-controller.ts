import { NextFunction, Request, Response } from "express";
import { knexConnection } from "@/database/knex";
import { z } from "zod";

import { AppError } from "@/utils/AppError.js";

const productSchema = z.object({
  name: z.string().trim().min(6),
  price: z.number({ required_error: "Price is required" }).gt(0, { message: "Price must be greater than 0" })
});

const productIdSchema = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), { message: "ID must be a number", path: ["id"] });

class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // throw new AppError("This is a custom error", 400);
      const { name } = request.query;

      const products = await knexConnection<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

      return response.json(products);
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
      // const { name, price } = bodySchema.parse(request.body);

      const { name, price } = productSchema.parse(request.body);

      await knexConnection<ProductRepository>("products").insert({ name, price });

      return response.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number({ required_error: "Price is required" }).gt(0, { message: "Price must be greater than 0" })
      });

      // const { name, price } = bodySchema.parse(request.body);

      const id = productIdSchema.parse(request.params.id);
      const { name, price } = productSchema.parse(request.body);

      const product = await knexConnection<ProductRepository>("products").where({ id: id }).first();

      if (!product) {
        throw new AppError("Product not found");
      }

      await knexConnection<ProductRepository>("products")
        .where({ id: id })
        .update({ name, price, updated_at: knexConnection.fn.now() });

      return response.json({ message: "Update product" });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = productIdSchema.parse(request.params.id);

      const product = await knexConnection<ProductRepository>("products").where({ id: id }).first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knexConnection<ProductRepository>("products").where({ id: id }).delete();

      return response.json({ message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  }
}

function getProductSchema() {
  return z.object({
    name: z.string().trim().min(6),
    price: z.number({ required_error: "Price is required" }).gt(0, { message: "Price must be greater than 0" })
  });
}

export { ProductsController };

import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { knexConnection } from "@/database/knex-connection";
import { TABLES } from "@/database/tables-config";
import { AppError } from "@/utils/AppError";

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number()
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(request.body);

      const session = await knexConnection<RestTablesSessionRepository>(TABLES.restTableSessions)
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError("RestTableSession was not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("RestTableSession is already closed", 400);
      }

      const product = await knexConnection<ProductRepository>(TABLES.products).where({ id: product_id }).first();

      if (!product) {
        throw new AppError("Product was not found", 404);
      }

      const order = await knexConnection(TABLES.orders).insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price
      });

      return response.status(201).json({ message: "Order created successfully", data: { session, product, order } });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params;

      const order = await knexConnection(TABLES.orders)
        .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "products.name",
          "orders.price",
          "orders.quantity",
          knexConnection.raw("orders.price * orders.quantity as total_price"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "orders.product_id", "products.id")
        .where({
          table_session_id
        })
        .orderBy("orders.created_at", "desc");

      return response.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params;

      const order = await knexConnection(TABLES.orders)
        .select(
          knexConnection.raw("COALESCE(SUM(orders.price * orders.quantity), 0) as total_price"),
          knexConnection.raw("COALESCE(SUM(orders.quantity), 0) as total_quantity")
        )
        .where({
          table_session_id
        });

      return response.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };

import { NextFunction, Request, Response } from "express";
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
}

export { ProductsController };

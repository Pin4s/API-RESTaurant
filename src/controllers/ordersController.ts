import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";
import { z } from 'zod'
import { AppError } from "@/utils/AppError";
import { OrderRepository } from "@/database/types/orderRepository";

class OrderController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_session_id: z.number(),
                product_id: z.number(),
                quantity: z.number()
            })

            const { table_session_id, product_id, quantity } = bodySchema.parse(req.body)

            const session = await knex<TablesSessionRepository>("tables_session").where({ id: table_session_id }).first()


            if (!session) {
                throw new AppError("Session table not found")
            }

            if (session.closed_at) {
                throw new AppError("This tables has already closed")
            }

            const product = await knex<ProductRepository>("products").where({ id: product_id }).first()

            if (!product) {
                throw new AppError("Products doesn't exist")
            }

            await knex<OrderRepository>("orders").insert({
                table_session_id,
                product_id,
                quantity,
                price: product.price
            })

            return res.status(201).json(product)

        } catch (error) {
            next(error)
        }

    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params
            const id = Number(table_session_id)

            const sessionExists = await knex("tables_session").where({ id: id }).first();
            console.log(sessionExists)
            if (!sessionExists || sessionExists.closed_at) {
                throw new AppError("Table session does not exist, or has already closed");
            }

            const order = await knex("orders")
                .select(
                    "orders.id",
                    "orders.table_session_id",
                    "orders.product_id",
                    "products.name",
                    "orders.price",
                    "orders.quantity",
                    knex.raw("orders.price * orders.quantity AS Total")
                )
                .join(
                    "products",
                    "products.id",
                    "orders.product_id"
                )
                .where(
                    {
                        "orders.table_session_id": table_session_id
                    }
                )
                .orderBy("orders.created_at", 'DESC')

            return res.json(order)
        } catch (error) {

            next(error)
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params

            const order = await knex("orders")
                .select(
                    knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS Total"),
                    knex.raw("SUM(orders.quantity) AS quantity")
                )
                .where({ table_session_id })
                .orderBy("orders.created_at", 'DESC').first()
            return res.json(order)
        } catch (error) {
            next(error)
        }
    }
}

export { OrderController }
import { Router } from "express";

import { tablesSessionsRoutes } from "./tablesSessionsRoutes";
import { productsRoutes } from './productsRoutes'
import { tablesRoutes } from "./tablesRoutes";
import { ordersRoutes } from "./ordersRoutes";

const routes = Router()

routes.use("/products", productsRoutes)
routes.use("/tables", tablesRoutes)
routes.use("/tables-sessions", tablesSessionsRoutes)
routes.use("/orders", ordersRoutes)

export { routes }
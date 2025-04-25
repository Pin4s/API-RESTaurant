import { Router } from "express";

import { TablesSessionController } from "@/controllers/tablesSessionController";

const tablesSessionsRoutes = Router()
const tablesSessionController = new TablesSessionController()

tablesSessionsRoutes.post("/", tablesSessionController.create)
tablesSessionsRoutes.get("/", tablesSessionController.index)
tablesSessionsRoutes.patch("/sessions/:id", tablesSessionController.update)

export { tablesSessionsRoutes }
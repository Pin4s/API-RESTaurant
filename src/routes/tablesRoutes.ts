import { Router } from 'express'

import { TablesController } from '@/controllers/tablesController'

const tablesRoutes = Router()
const tablesController = new TablesController()

tablesRoutes.get("/", tablesController.index)

export {tablesRoutes}
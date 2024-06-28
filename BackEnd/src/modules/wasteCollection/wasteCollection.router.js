import { Router } from "express"
import * as wasteController from "./wasteCollection.controller.js"

const router = Router()

router.post('/schedule',wasteController.ScheduleWasteCollection);

export default router
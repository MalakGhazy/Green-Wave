import { Router } from "express"
import * as wasteController from "./wasteCollection.controller.js"
import { auth, roles } from "../../middleware/auth.js";
const router = Router()

router.post('/schedule',auth([roles.user]),wasteController.ScheduleWasteCollection);

export default router
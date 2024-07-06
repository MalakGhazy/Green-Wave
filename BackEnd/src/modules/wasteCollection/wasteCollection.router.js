import { Router } from "express"
import * as wasteController from "./wasteCollection.controller.js"
import { auth } from "../../middleware/auth.js";

const router = Router()

router.post('/schedule',auth(),wasteController.ScheduleWasteCollection);

export default router
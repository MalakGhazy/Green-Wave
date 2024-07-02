import { Router } from "express";
import * as urbanGreeningController from "./urbanGreening.controller.js";

const router = Router();

router.post('/request', urbanGreeningController.requestUrbanGreening);
router.get('/guidance', urbanGreeningController.getUrbanGreeningGuidance);

export default router;

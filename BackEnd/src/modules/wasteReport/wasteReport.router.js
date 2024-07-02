import { Router } from 'express';
import * as wasteReportController from './wasteReport.controller.js';

const router = Router();

router.post('/report', wasteReportController.reportWasteSite);
router.get('/reports', wasteReportController.getReportedSites);
router.get('/points/:userId', wasteReportController.getUserPoints);

export default router;

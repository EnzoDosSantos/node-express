import { Router } from 'express';
import { alertsController } from '../controllers/alerts.controller';

const router = Router();

router.post('/alert', alertsController.sendAlert);

export default router;


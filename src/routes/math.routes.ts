import { Router } from 'express';
import { mathController } from '../controllers/math.controller';

const router = Router();

router.get('/lcm', mathController.calculateLcm);
router.get('/increment', mathController.increment);

export default router;

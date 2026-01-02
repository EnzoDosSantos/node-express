import { Router } from 'express';
import jokesRoutes from './jokes.routes';
import mathRoutes from './math.routes';
import protectedRoutes from './protected.routes';
import alertsRoutes from './alerts.routes';

const router = Router();

router.use('/chistes', jokesRoutes);
router.use('/math', mathRoutes);
router.use(protectedRoutes);
router.use(alertsRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;

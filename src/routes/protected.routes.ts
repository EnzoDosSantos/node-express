import { Router } from 'express';
import { protectedController } from '../controllers/protected.controller';
import { authenticate, authorize } from '../auth/middleware/authenticate';

const router = Router();

router.get('/usuario', authenticate, authorize('user', 'admin'), protectedController.getUserData);

router.get('/admin', authenticate, authorize('admin'), protectedController.getAdminData);

export default router;


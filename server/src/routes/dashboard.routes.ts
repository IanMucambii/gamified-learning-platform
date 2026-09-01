import { Router } from 'express';
import auth from '../middleware/auth';
import role from '../middleware/role';
import { getMyDashboard } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', auth, role('Patient'), getMyDashboard);

export default router;
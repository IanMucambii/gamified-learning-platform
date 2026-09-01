import { Router } from 'express';
import auth from '../middleware/auth';
import role from '../middleware/role';
import { listActivities } from '../controllers/activities.controller';

const router = Router();

router.get('/', auth, role('Patient'), listActivities);

export default router;
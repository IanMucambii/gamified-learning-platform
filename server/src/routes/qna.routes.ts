import { Router } from 'express';
import auth from '../middleware/auth';
import role from '../middleware/role';
import {
  createQuestion,
  answerQuestion,
  getAll,
  updateQuestion,
  deleteQuestion,
} from '../controllers/qna.controller';

const router = Router();

router.post('/', auth, role('Patient', 'Doctor'), createQuestion);
router.get('/', auth, getAll);
router.patch('/:id/answer', auth, role('Patient', 'Doctor'), answerQuestion);
router.put('/:id', auth, role('Patient', 'Doctor'), updateQuestion);
router.delete('/:id', auth, role('Doctor', 'admin'), deleteQuestion);

export default router;
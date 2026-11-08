import { Router } from 'express';
import auth from '../middleware/auth';
import role from '../middleware/role';
import {
  generateFromMaterial,
  createPuzzle,
  getPuzzles,
  updatePuzzle,
  deletePuzzle,
  solvePuzzle,
  getMyPuzzlesStats,
  getLeaderboard,
  getPuzzleById
} from '../controllers/puzzle.controller';

const router = Router();

router.post('/generate/:materialId', auth, role('Doctor'), generateFromMaterial);
router.post('/', auth, role('Doctor'), createPuzzle);
router.get('/', auth, getPuzzles);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/my-stats', auth, role('Patient'), getMyPuzzlesStats);
router.put('/:id', auth, role('Doctor', 'admin'), updatePuzzle);
router.get('/:id', auth, getPuzzleById);  
router.delete('/:id', auth, role('Doctor', 'admin'), deletePuzzle);
router.post('/:id/solve', auth, role('Patient'), solvePuzzle);

export default router;
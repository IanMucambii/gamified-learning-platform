import { Router } from 'express';
import auth from '../middleware/auth';
import role from '../middleware/role';
import { imageUpload } from '../middleware/upload';
import {
  createGame,
  getGames,
  updateGame,
  deleteGame,
  getGameForPlay,
  submitAttempt,
  getMyStats,
  getLeaderboard,
} from '../controllers/resonance.controller';

const router = Router();

router.post('/', auth, role('Doctor'), imageUpload.array('images'), createGame);
router.get('/', auth, getGames);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/my-stats', auth, role('Patient'), getMyStats);
router.get('/:id/play', auth, role('Patient'), getGameForPlay);
router.post('/:id/attempt', auth, role('Patient'), submitAttempt);
router.put('/:id', auth, role('Doctor'), updateGame);
router.delete('/:id', auth, role('Doctor', 'admin'), deleteGame);

export default router;
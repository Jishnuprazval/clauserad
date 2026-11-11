import { Router } from 'express';
import { getAnalysisById, getAnalysisHistory, getDashboard } from '../controllers/analysisController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', optionalAuth, getDashboard);
router.get('/history', optionalAuth, getAnalysisHistory);
router.get('/:id', optionalAuth, getAnalysisById);

export default router;

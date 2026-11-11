import { Router } from 'express';
import { compareContracts } from '../controllers/comparisonController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', optionalAuth, compareContracts);

export default router;

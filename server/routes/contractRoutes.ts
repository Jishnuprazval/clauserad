import { Router } from 'express';
import multer from 'multer';
import {
  uploadPdfContract,
  analyzeTextContract,
  getSampleDemo,
  getUserContracts,
  getContractById,
  deleteContract,
} from '../controllers/contractController';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for PDF memory buffer storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are supported'));
    }
  },
});

router.post('/upload', optionalAuth, upload.single('file'), uploadPdfContract);
router.post('/analyze-text', optionalAuth, analyzeTextContract);
router.get('/sample-demo', getSampleDemo);
router.get('/', optionalAuth, getUserContracts);
router.get('/:id', optionalAuth, getContractById);
router.delete('/:id', optionalAuth, deleteContract);

export default router;

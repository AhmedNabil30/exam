import express from 'express';
import { ExamController } from '../controllers/examController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:studentId/submit', 
  authMiddleware, 
  ExamController.submitExam
);
router.get('/:studentId/result', 
  authMiddleware, 
  ExamController.getExamResult
);

export default router;
import express from 'express';
import { QuestionController } from '../controllers/questionController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, QuestionController.getAllQuestions);
router.get('/model/:modelId', authMiddleware, QuestionController.getQuestionsByModel);
router.post('/', 
  authMiddleware, 
  requireRole(['admin']), 
  QuestionController.addQuestion
);
router.delete('/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  QuestionController.deleteQuestion
);

export default router;
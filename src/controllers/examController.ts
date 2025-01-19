// src/controllers/examController.ts
import { Request, Response } from 'express';
import { ExamService } from '../services/examService';

export class ExamController {
  // Submit exam
  static async submitExam(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.studentId);
      const { answers, cheatAttempts } = req.body;
      
      // Validate input
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid answers format' });
      }

      // Submit answers with cheat attempts
      const examResult = await ExamService.submitAnswers(
        studentId, 
        answers, 
        cheatAttempts || 0
      );

      res.json({
        ...examResult.toObject(),
        message: examResult.penaltyApplied 
          ? 'Cheating penalty applied' 
          : 'Exam submitted successfully'
      });
    } catch (error) {
      console.error('Exam submission error:', error);
      res.status(500).json({ 
        message: 'Error submitting exam',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get exam result
  static async getExamResult(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.studentId);
      
      const examResult = await ExamService.getExamResult(studentId);
      
      if (!examResult) {
        return res.status(404).json({ message: 'No exam result found' });
      }

      res.json(examResult);
    } catch (error) {
      console.error('Error fetching exam result:', error);
      res.status(500).json({ 
        message: 'Error fetching exam result',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
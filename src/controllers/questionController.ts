import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';

export class QuestionController {
  // Get all questions
  static async getAllQuestions(req: Request, res: Response) {
    try {
      const questions = await QuestionService.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Error fetching questions' });
    }
  }

  // Get questions by model
  static async getQuestionsByModel(req: Request, res: Response) {
    try {
      const modelId = Number(req.params.modelId);
      const questions = await QuestionService.getQuestionsByModel(modelId);
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions by model:', error);
      res.status(500).json({ message: 'Error fetching questions' });
    }
  }

  // Add a new question
  static async addQuestion(req: Request, res: Response) {
    try {
      const questionData = req.body;
      const newQuestion = await QuestionService.addQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ message: 'Error adding question' });
    }
  }

  // Delete a question
  static async deleteQuestion(req: Request, res: Response) {
    try {
      const questionId = Number(req.params.id);
      await QuestionService.deleteQuestion(questionId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Error deleting question' });
    }
  }
}

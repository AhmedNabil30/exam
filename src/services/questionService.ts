import { Question, IQuestion } from '../models/Question';
import { mockQuestions } from './mockData';

export class QuestionService {
  // Get all questions
  static async getAllQuestions(): Promise<IQuestion[]> {
    const existingQuestions = await Question.find();
    
    // If no questions in DB, seed with mock data
    if (existingQuestions.length === 0) {
      return this.seedQuestions();
    }
    
    return existingQuestions;
  }

  // Get questions by model
  static async getQuestionsByModel(modelId: number): Promise<IQuestion[]> {
    const questions = await Question.find({ modelId });
    
    // If no questions for this model, seed with mock data
    if (questions.length === 0) {
      return this.seedQuestions().then(
        questions => questions.filter(q => q.modelId === modelId)
      );
    }
    
    return questions;
  }

  // Add a new question
  static async addQuestion(questionData: Partial<IQuestion>): Promise<IQuestion> {
    const newId = await this.generateUniqueId();
    const question = new Question({
      ...questionData,
      id: newId
    });
    return question.save();
  }

  // Delete a question
  static async deleteQuestion(id: number): Promise<void> {
    await Question.deleteOne({ id });
  }

  // Generate unique ID for questions
  private static async generateUniqueId(): Promise<number> {
    const maxQuestion = await Question.findOne().sort('-id');
    return maxQuestion ? maxQuestion.id + 1 : 1;
  }

  // Seed questions from mock data
  private static async seedQuestions(): Promise<IQuestion[]> {
    // Convert mock questions to Mongoose documents
    const questionDocs = mockQuestions.map(q => new Question(q));
    
    // Insert many and return as IQuestion[]
    return Question.insertMany(questionDocs) as unknown as IQuestion[];
  }
}
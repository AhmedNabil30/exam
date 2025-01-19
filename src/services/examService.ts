// src/services/examService.ts
import { ExamResult, IExamResult } from '../models/Result';
import { Student } from '../models/Student';
import { Question } from '../models/Question';
import { IStudentAnswer } from '../models/StudentAnswer';

export class ExamService {
  static async submitAnswers(
    studentId: number, 
    answers : IStudentAnswer[], 
    cheatAttempts: number = 0
  ): Promise<IExamResult> {
    try {
      // Fetch relevant questions
      const questions = await Question.find({
        id: { $in: answers.map(a => a.questionId) }
      });

      // Calculate basic exam results
      const totalQuestions = answers.length;
      const questionResults = answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return {
          questionId: answer.questionId,
          questionText: question?.text || '',
          studentAnswer: answer.answer,
          correctAnswer: question?.correctAnswer || '',
          isCorrect: question?.correctAnswer === answer.answer
        };
      });

      const correctAnswers = questionResults.filter(r => r.isCorrect).length;
      let grade = Math.round((correctAnswers / totalQuestions) * 100);

      // Cheating penalty logic
      let penaltyApplied = false;
      if (cheatAttempts > 0) {
        // Escalating penalty based on cheat attempts
        if (cheatAttempts <= 3) {
          // Minor penalty
          grade = Math.max(0, grade - (cheatAttempts * 5));
        } else if (cheatAttempts <= 5) {
          // Moderate penalty
          grade = Math.max(0, grade - (cheatAttempts * 10));
          penaltyApplied = true;
        } else {
          // Severe penalty - automatic failure
          grade = 0;
          penaltyApplied = true;
        }
      }

      // Create and save exam result
      const examResult = new ExamResult({
        studentId,
        modelId: questions[0]?.modelId || 1,
        totalQuestions,
        correctAnswers,
        grade,
        timeSpent: 3600, // Default time
        cheatAttempts,
        penaltyApplied,
        questionResults
      });

      // Log cheating attempts
      if (cheatAttempts > 0) {
        await this.logCheatAttempts(studentId, cheatAttempts);
      }

      return examResult.save();
    } catch (error) {
      console.error('Exam submission error:', error);
      throw error;
    }
  }

  // Log cheating attempts to student record
  private static async logCheatAttempts(studentId: number, attempts: number) {
    try {
      await Student.findOneAndUpdate(
        { id: studentId },
        { 
          $inc: { cheatAttempts: attempts },
          $set: { lastCheatAttempt: new Date() }
        }
      );
    } catch (error) {
      console.error('Error logging cheat attempts:', error);
    }
  }

  // Retrieve exam result
  static async getExamResult(studentId: number): Promise<IExamResult | null> {
    return ExamResult.findOne({ studentId }).sort({ dateTaken: -1 });
  }
}
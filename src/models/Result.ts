// src/models/exam-result.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionResult {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface IExamResult extends Document {
  studentId: number;
  modelId: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: number;
  timeSpent: number;
  dateTaken: Date;
  cheatAttempts: number;
  questionResults: IQuestionResult[];
  penaltyApplied?: boolean;
}

const QuestionResultSchema: Schema = new Schema({
  questionId: { type: Number, required: true },
  questionText: { type: String, required: true },
  studentAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const ExamResultSchema: Schema = new Schema({
  studentId: { type: Number, required: true },
  modelId: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  grade: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
  dateTaken: { type: Date, default: Date.now },
  cheatAttempts: { type: Number, default: 0 },
  penaltyApplied: { type: Boolean, default: false },
  questionResults: { type: [QuestionResultSchema], required: true }
});

export const ExamResult = mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
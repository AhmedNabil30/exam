import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentAnswer extends Document {
  studentId: number;
  questionId: number;
  answer: string;
}

const StudentAnswerSchema: Schema = new Schema({
  studentId: { type: Number, required: true },
  questionId: { type: Number, required: true },
  answer: { type: String, required: true }
});

export const StudentAnswer = mongoose.model<IStudentAnswer>('StudentAnswer', StudentAnswerSchema);

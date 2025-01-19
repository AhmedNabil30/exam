import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  id: number;
  modelId: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const QuestionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  modelId: { type: Number, required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

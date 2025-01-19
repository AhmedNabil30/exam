// src/services/mockData.ts
import { IQuestion } from '../models/Question';

export const mockQuestions: Partial<IQuestion>[] = [
  {
    id: 1,
    modelId: 1,
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    id: 2,
    modelId: 1,
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    id: 3,
    modelId: 2,
    text: 'What is the largest planet in our solar system?',
    options: ['Mars', 'Saturn', 'Jupiter', 'Neptune'],
    correctAnswer: 'Jupiter'
  },
  {
    id: 4,
    modelId: 2,
    text: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'],
    correctAnswer: 'Da Vinci'
  }
];
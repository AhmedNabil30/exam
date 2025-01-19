import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStudent extends Document {
  id: number;
  name: string;
  email?: string;
  role: 'student' | 'admin';
  examModel: number;
  grade?: number;
  password?: string;
  program?: string;
  level?: string;
  cheatAttempts?: number;
  lastCheatAttempt?: Date;
}

const StudentSchema: Schema<IStudent> = new Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true,
    sparse: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  examModel: { 
    type: Number, 
    required: true 
  },
  grade: { 
    type: Number 
  },
  password: { 
    type: String 
  },
  program: { 
    type: String 
  },
  level: { 
    type: String 
  },
  cheatAttempts: { 
    type: Number, 
    default: 0 
  },
  lastCheatAttempt: { 
    type: Date 
  }
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
// src/controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { Student } from '../models/Student';

export class AuthController {
  // Login method
  static async login(req: Request, res: Response) {
    try {
      const { studentId, password } = req.body;

      if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
      }

      const result = await AuthService.authenticateStudent(
        Number(studentId), 
        password
      );

      if (!result) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const { student, token } = result;

      res.json({
        id: student.id,
        name: student.name,
        role: student.role,
        examModel: student.examModel,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get current user profile
  static async profile(req: Request, res: Response) {
    try {
      const studentId = req.user?.studentId;
      
      if (!studentId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const student = await Student.findOne({ id: studentId });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json({
        id: student.id,
        name: student.name,
        role: student.role,
        examModel: student.examModel,
        program: student.program,
        level: student.level,
        grade: student.grade
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get student by ID
  static async getStudentById(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.id);

      const student = await Student.findOne({ id: studentId });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json({
        id: student.id,
        name: student.name,
        role: student.role,
        examModel: student.examModel,
        program: student.program,
        level: student.level,
        grade: student.grade
      });
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
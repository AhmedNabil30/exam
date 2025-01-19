// src/services/authService.ts
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Student, IStudent } from '../models/Student';
import { environment } from '../config/environment';

export class AuthService {
  // Create a new student
  static async createStudent(studentData: Partial<IStudent>): Promise<IStudent> {
    // Ensure role is correctly typed
    const dataToSave: Partial<IStudent> = {
      ...studentData,
      role: studentData.role || 'student'
    };

    // Hash password if provided
    if (dataToSave.password) {
      dataToSave.password = await bcrypt.hash(dataToSave.password, 10);
    }

    const student = new Student(dataToSave);
    return student.save();
  }

  // Seed initial admin and students
  static async seedInitialUsers() {
    // Seed admin
    const adminCount = await Student.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      await this.createStudent({
        id: 9999,
        name: 'Admin',
        email: 'admin@examsystem.com',
        role: 'admin',
        password: 'admin123',
        examModel: 1
      });
    }

    // Seed students
    const studentCount = await Student.countDocuments({ role: 'student' });
    if (studentCount === 0) {
      const studentsToSeed: Partial<IStudent>[] = [
        {
          id: 223101187,
          name: 'ABDALALIM, HASSAN MOHAMED ABDALHAMEED',
          email: 'hassan.abdalalim@example.com',
          role: 'student',
          examModel: 1,
          program: 'AI Science - AI Science',
          level: 'Sophomore'
        },
        {
          id: 223103134,
          name: 'ABDALLAH, JANA MOHAMED BESHEER AHMED',
          email: 'jana.abdallah@example.com',
          role: 'student',
          examModel: 1,
          program: 'AI Science - AI Science',
          level: 'Sophomore'
        }
      ];

      for (const studentData of studentsToSeed) {
        await this.createStudent(studentData);
      }
    }
  }

  // Authenticate student by ID
  static async authenticateStudent(
    studentId: number, 
    password?: string
  ): Promise<{ student: IStudent; token: string } | null> {
    const student = await Student.findOne({ id: studentId });

    if (!student) return null;

    // If password is set, verify it
    if (student.password) {
      if (!password) return null;
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) return null;
    }

    // Generate token
    const token = this.generateToken({
      studentId: student.id,
      role: student.role
    });

    return { student, token };
  }

  // Generate JWT token
  private static generateToken(payload: { studentId: number, role: 'student' | 'admin' }): string {
    return jwt.sign(
      payload, 
      environment.JWT_SECRET, 
      { expiresIn: '24h' }
    );
  }
}
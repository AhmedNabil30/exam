// src/controllers/studentController.ts
import { Request, Response } from 'express';
import { Student, IStudent } from '../models/Student';

export class StudentController {
  // Get all students
  static async getAllStudents(req: Request, res: Response) {
    try {
      const { includeResults } = req.query;
      let students;

      if (includeResults === 'true') {
        // Fetch students with exam results
        students = await Student.aggregate([
          {
            $lookup: {
              from: 'examresults',
              localField: 'id',
              foreignField: 'studentId',
              as: 'examResult'
            }
          },
          {
            $addFields: {
              grade: {
                $ifNull: [{ $arrayElemAt: ['$examResult.grade', 0] }, undefined]
              }
            }
          },
          {
            $project: {
              examResult: 0 // Remove the examResult array from the output
            }
          }
        ]);
      } else {
        students = await Student.find();
      }

      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Error fetching students' });
    }
  }

  // Get student by ID
  static async getStudentById(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.id);
      const { includeResults } = req.query;
      let student;

      if (includeResults === 'true') {
        [student] = await Student.aggregate([
          {
            $match: { id: studentId }
          },
          {
            $lookup: {
              from: 'examresults',
              localField: 'id',
              foreignField: 'studentId',
              as: 'examResult'
            }
          },
          {
            $addFields: {
              grade: {
                $ifNull: [{ $arrayElemAt: ['$examResult.grade', 0] }, undefined]
              }
            }
          },
          {
            $project: {
              examResult: 0
            }
          }
        ]);
      } else {
        student = await Student.findOne({ id: studentId });
      }

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Error fetching student' });
    }
  }
  // Add a new student
  static async addStudent(req: Request, res: Response) {
    try {
      const studentData: Partial<IStudent> = req.body;
      
      // Check if student with this ID already exists
      const existingStudent = await Student.findOne({ id: studentData.id });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student with this ID already exists' });
      }

      const newStudent = new Student(studentData);
      await newStudent.save();
      
      res.status(201).json(newStudent);
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ 
        message: 'Error adding student',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Bulk upload students
  static async bulkUploadStudents(req: Request, res: Response) {
    try {
      const studentsData: Partial<IStudent>[] = req.body;
      
      const results = await Promise.all(
        studentsData.map(async (studentData) => {
          try {
            // Check if student already exists
            const existingStudent = await Student.findOne({ id: studentData.id });
            if (existingStudent) {
              return { 
                id: studentData.id, 
                status: 'skipped', 
                message: 'Student already exists' 
              };
            }

            // Create new student
            const newStudent = new Student({
              ...studentData,
              role: 'student',
              examModel: studentData.program?.includes('AI Science') ? 1 : 2
            });
            await newStudent.save();

            return { 
              id: studentData.id, 
              status: 'created', 
              message: 'Student added successfully' 
            };
          } catch (error) {
            return { 
              id: studentData.id, 
              status: 'error', 
              message: error instanceof Error ? error.message : 'Unknown error' 
            };
          }
        })
      );

      res.status(201).json({
        totalStudents: studentsData.length,
        results
      });
    } catch (error) {
      console.error('Error in bulk upload:', error);
      res.status(500).json({ 
        message: 'Error in bulk upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update student
  static async updateStudent(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.id);
      const updateData = req.body;

      const student = await Student.findOneAndUpdate(
        { id: studentId }, 
        updateData, 
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Error updating student' });
    }
  }

  // Delete student
  static async deleteStudent(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.id);
      
      const result = await Student.deleteOne({ id: studentId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Error deleting student' });
    }
  }
}
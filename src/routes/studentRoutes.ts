// src/routes/studentRoutes.ts
import express from 'express';
import { StudentController } from '../controllers/studentController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// Get all students (admin only)
router.get('/', 
  authMiddleware, 
  requireRole(['admin']), 
  StudentController.getAllStudents
);

// Get student by ID (authenticated users)
router.get('/:id', 
  authMiddleware, 
  StudentController.getStudentById
);

// Add a new student (admin only)
router.post('/', 
  authMiddleware, 
  requireRole(['admin']), 
  StudentController.addStudent
);

// Bulk upload students (admin only)
router.post('/bulk', 
  authMiddleware, 
  requireRole(['admin']), 
  StudentController.bulkUploadStudents
);

// Update student (admin only)
router.put('/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  StudentController.updateStudent
);

// Delete student (admin only)
router.delete('/:id', 
  authMiddleware, 
  requireRole(['admin']), 
  StudentController.deleteStudent
);

export default router;
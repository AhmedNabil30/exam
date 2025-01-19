// scripts/bulkStudentImport.ts
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import { Student, IStudent } from '../src/models/Student';
import { environment } from '../src/config/environment';
import * as path from 'path';
import * as fs from 'fs';

// Define a type for the row data
type ExcelRow = (string | number)[];

// Define a specific type for student data
interface StudentImportData {
  id: number;
  name: string;
  program: string;
  level: string;
  examModel: number;
  role: 'student';
}

// Function to parse Excel file and extract student data
function parseExcelFile(filePath: string): StudentImportData[] {
  // Read the workbook
  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    cellNF: false,
    cellText: true
  });

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON, allowing for different possible header structures
  const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,  // Use numeric headers
    defval: ''  // Default value for empty cells
  });

  // Process rows, skipping the header
  return data.slice(1).reduce<StudentImportData[]>((acc, row) => {
    // Validate row has enough columns
    if (row.length < 7) {
      console.warn(`Skipping invalid row:`, row);
      return acc;
    }

    // Safely convert to strings and parse
    const safeString = (value: string | number): string => 
      value !== undefined ? String(value).trim() : '';

    // Parse student data
    const studentId = parseInt(safeString(row[1]), 10);
    
    // Skip invalid IDs
    if (isNaN(studentId)) {
      console.warn(`Skipping row with invalid ID:`, row);
      return acc;
    }

    const studentData: StudentImportData = {
      id: studentId,
      name: safeString(row[2]), // Ensure name is a string
      program: safeString(row[5]), // Program
      level: safeString(row[6]), // Academic level
      examModel: safeString(row[5]).includes('AI Science') ? 1 : 2,
      role: 'student'
    };

    acc.push(studentData);
    return acc;
  }, []);
}

// Main import function
async function importStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(environment.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Define file paths - support multiple Excel files
    const filePaths = [
      path.join(__dirname, '../BMD191.xls'),
      path.join(__dirname, '../CSE191.xls'),
      path.join(__dirname, '../AIE191.xls')
    ];

    // Collect students from all files
    const allStudents: StudentImportData[] = [];
    
    filePaths.forEach(filePath => {
      // Check if file exists before parsing
      if (fs.existsSync(filePath)) {
        console.log(`Parsing file: ${filePath}`);
        const students = parseExcelFile(filePath);
        allStudents.push(...students);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    });

    // Import students
    const importResults = await Promise.all(
      allStudents.map(async (studentData) => {
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
          const newStudent = new Student(studentData);
          await newStudent.save();

          return { 
            id: studentData.id, 
            status: 'created', 
            name: studentData.name 
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

    // Output results
    console.log('Import Results:');
    console.log('Total students:', importResults.length);
    console.log('Created:', importResults.filter(r => r.status === 'created').length);
    console.log('Skipped:', importResults.filter(r => r.status === 'skipped').length);
    console.log('Errors:', importResults.filter(r => r.status === 'error').length);

    // Log detailed results if needed
    const errors = importResults.filter(r => r.status === 'error');
    if (errors.length > 0) {
      console.log('Error Details:');
      console.log(errors);
    }
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
  }
}

// Run the import
importStudents().catch(console.error);
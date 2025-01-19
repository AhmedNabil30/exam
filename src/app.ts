import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import { environment } from './config/environment';
import { AuthService } from './services/authService';

// Import routes
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import examRoutes from './routes/examRoutes';
import studentRoutes from './routes/studentRoutes';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        studentId: number;
        role: 'student' | 'admin';
      }
    }
  }
}

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
  }

  private initializeMiddlewares() {
    // Security middlewares
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: ['http://localhost:4200', 'http://localhost:3000'], // Adjust as needed
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    // Base route
    this.app.get('/', (req, res) => {
      res.json({ message: 'Exam System Backend is running' });
    });

    // Authentication routes
    this.app.use('/api/auth', authRoutes);
    
    // Question routes
    this.app.use('/api/questions', questionRoutes);
    
    // Exam routes
    this.app.use('/api/exam', examRoutes);
    
    // Student routes
    this.app.use('/api/students', studentRoutes);
  }

  private async connectToDatabase() {
    try {
      await connectDatabase();
      
      // Seed initial users if needed
      await AuthService.seedInitialUsers();
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  public listen() {
    this.app.listen(environment.PORT, () => {
      console.log(`Server running on port ${environment.PORT}`);
    });
  }
}

const app = new App();
app.listen();

export default app;
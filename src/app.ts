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
    // CORS configuration - Must be before other middleware
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        const allowedOrigins = [
          'http://localhost:4200',
          'http://localhost:3000',
          'https://web-production-d7e01.up.railway.app',
          undefined // Allow requests with no origin (like mobile apps or curl requests)
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    };

    this.app.use(cors(corsOptions));

    // Security middlewares with adjusted settings for CORS
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "unsafe-none" }
    }));

    // Additional CORS headers middleware
    this.app.use((req, res, next) => {
      const allowedOrigins = [
        'http://localhost:4200',
        'http://localhost:3000',
        'https://web-production-d7e01.up.railway.app'
      ];
      const origin = req.headers.origin;
      
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
      
      next();
    });

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

    // Error handling for CORS
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err.message === 'Not allowed by CORS') {
        res.status(403).json({
          error: 'CORS Error',
          message: 'Origin not allowed'
        });
      } else {
        next(err);
      }
    });
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
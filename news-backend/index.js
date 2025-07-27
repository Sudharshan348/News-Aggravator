import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter.js';
import connectDB from './db/index.js'

connectDB()
const app = express();
app.use(cors({
  origin: [
    'https://news-aggravator.vercel.app/',
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://localhost:4173', 
    'https://localhost:5173',
    'https://127.0.0.1:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.get('Origin') || 'no-origin'}`);
  next();
});

app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.json({ 
        message: 'News API Backend is running!',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        cors: 'enabled',
        endpoints: {
            headlines: '/api/news/headlines',
            search: '/api/search',
            saved: '/api/saved'
        },
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
app.use((err, req, res, next) => {
    console.error('Server Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        origin: req.get('Origin')
    });
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
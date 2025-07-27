import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter.js';
import connectDB from './db/index.js'

connectDB()
const app = express();
app.use(cors({
  origin: ['https://localhost:5173', 'http:localhost:3000','https://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', apiRouter);
app.get('/', (req,res) => {
    res.json({ 
        message: 'News API Backend is running!',
        endpoints: {
            headlines: '/api/news/headlines',
            search: '/api/search',
            saved: '/api/saved'
        }
    })
})

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        availableRoutes: ['/api/news/headlines', '/api/search', '/api/saved']
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Listening at 3000, API is available;");
});

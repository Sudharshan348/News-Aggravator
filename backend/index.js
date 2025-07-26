import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import newsRouter from './routes/news.js';
import connectDB from './db/index.js'
import savedNewsRoutes from './routes/SavedNews.js'

connectDB()
const app = express();
app.use('/api', newsRouter);
app.use('/api',savedNewsRoutes)
app.get('/', (req,res) => {
    res.send('API is executing and backend is working')
})
app.listen(3000, () => {
  console.log("Server is Listening at 3000;");
});

import express from "express";
import axios from "axios";
const router = express.Router();

router.get('/headlines', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
    }
    );
    res.json(response.data);
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch news'
    })
  }
});

export default router;

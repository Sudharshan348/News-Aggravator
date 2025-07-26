import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/', async (req, res) => {
  const { q, from, to, source } = req.query;

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q,
        sources: source,
        from,
        to,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: 'News API failed', details: error.message });
  }
});

export default router;
import express from "express";
import axios from "axios";
import { Article } from '../models/article.js'
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
    const articles = response.data.articles;

    for (let item of articles) {
      const exists = await Article.findOne({ title: item.title });
      if (!exists) {
        const article = new Article({
          title: item.title,
          url: item.url,
          source: item.source.name,
          publishedAt: new Date(item.publishedAt),
          content: item.content || "",
        });
        await article.save();
      }
    }

    res.json({ message: "Articles fetched and stored", count: articles.length, data: response.data });
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch news'
    })
  }
});

export default router;

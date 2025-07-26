import express from 'express';
import { Article } from '../models/article.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ publishedAt: -1 })
      .limit(50);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching saved articles" });
  }
});

export default router;

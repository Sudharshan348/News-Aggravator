import express from "express";
import axios from "axios";
import { Article } from '../models/article.js'
const router = express.Router();

router.get('/headlines', async (req, res) => {
  try {
    const recentArticles = await Article.find()
      .sort({ publishedAt: -1 })
      .limit(50);
    if (recentArticles.length > 0) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const hasRecentArticles = recentArticles.some(article => 
        new Date(article.createdAt) > oneHourAgo
      );

      if (hasRecentArticles) {
        return res.json({ 
          message: "Articles from database", 
          count: recentArticles.length, 
          data: { articles: recentArticles },
          fromCache: true
        });
      }
    }
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 50
      },
    });

    const articles = response.data.articles;
    const savedArticles = [];
    for (let item of articles) {
      if (!item.title || item.title === '[Removed]') continue;
      
      const exists = await Article.findOne({ title: item.title });
      if (!exists) {
        const article = new Article({
          title: item.title,
          url: item.url,
          source: item.source?.name || 'Unknown',
          publishedAt: new Date(item.publishedAt),
          content: item.content || item.description || "",
          category: 'general',
          urlToImage: item.urlToImage
        });
        const saved = await article.save();
        savedArticles.push(saved);
      } else {
        savedArticles.push(exists);
      }
    }
    const allArticles = await Article.find()
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json({ 
      message: "Articles fetched and stored", 
      count: allArticles.length, 
      data: { articles: allArticles },
      fromCache: false
    });
  } catch (error) {
    console.error('News API error:', error.response?.data || error.message);
    try {
      const fallbackArticles = await Article.find()
        .sort({ publishedAt: -1 })
        .limit(50);
      
      res.json({
        message: "Fallback to saved articles",
        count: fallbackArticles.length,
        data: { articles: fallbackArticles },
        fromCache: true
      });
    } catch (dbError) {
      res.status(500).json({
        error: 'Failed to fetch news and database unavailable'
      });
    }
  }
});

export default router;
import express from 'express'
import axios from 'axios'
import {Article} from '../models/article.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const { q, from, to, source, category, sortBy='publishedAt', language='en' } = req.query;
  if (!q || q.trim() === '') return res.status(400).json({error: 'Search enquiry is missing'})
  try {
    //Searching through database
    const dbQuery = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    };
    if (source) {
      dbQuery.source = { $regex: source, $options: 'i' };
    }
    if (category) {
      dbQuery.category = category;
    }
    if (from || to) {
      dbQuery.publishedAt = {};
      if (from) dbQuery.publishedAt.$gte = new Date(from);
      if (to) dbQuery.publishedAt.$lte = new Date(to);
    }

    let dbResults = await Article.find(dbQuery)
      .sort({ publishedAt: -1 })
      .limit(100);
    if (dbResults.length >= 10) {
      return res.json(dbResults);
    }
    //Searching through API
    const apiParams = {
      q,
      language,
      sortBy: sortBy === 'title' ? 'publishedAt' : sortBy,
      pageSize: 50,
      apiKey: process.env.NEWS_API_KEY
    };

    if (source) apiParams.sources = source;
    if (from) apiParams.from = from;
    if (to) apiParams.to = to;

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: apiParams
    });

    const articles = response.data.articles || [];
    const savedArticles = [];

    // Saving searched articles
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
          category: category || 'general',
          urlToImage: item.urlToImage
        });
        const saved = await article.save();
        savedArticles.push(saved);
      } else {
        savedArticles.push(exists);
      }
    }

    const combinedResults = [...dbResults];
    
    savedArticles.forEach(newArticle => {
      const exists = combinedResults.find(existing => 
        existing.title === newArticle.title
      );
      if (!exists) {
        combinedResults.push(newArticle);
      }
    });

    // SortBy paramter
    combinedResults.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'relevancy':
        case 'popularity':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'publishedAt':
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });

    res.json(combinedResults.slice(0, 50));

  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    
    //Fallback
    try {
      const fallbackQuery = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ]
      };

      const fallbackResults = await Article.find(fallbackQuery)
        .sort({ publishedAt: -1 })
        .limit(50);

      res.json(fallbackResults);
    } catch (dbError) {
      res.status(500).json({ 
        error: 'Search failed and database unavailable', 
        details: error.message 
      });
    }
  }
});

export default router;
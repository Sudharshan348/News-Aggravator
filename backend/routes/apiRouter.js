import express from 'express'
import newsRoutes from './news.js'
import savedNewsRoutes from './SavedNews.js'
import searchNewsRoutes from './search.js'
const router = express.Router();
router.use('/news',newsRoutes)
router.use('/saved',savedNewsRoutes)
router.use('/search',searchNewsRoutes)

export default router

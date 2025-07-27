# 📰 News Aggregator

A full-stack news aggregation application that fetches, displays, and stores news articles from various sources with search functionality.

## ✨ Features

- Fetch latest headlines from NewsAPI
- Search articles by keywords, date, and source
- Save articles to MongoDB database
- Responsive design with modern UI

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- NewsAPI integration
- CORS enabled

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- NewsAPI key from [newsapi.org](https://newsapi.org)

### Backend Setup
```bash
cd news-backend
npm install

# Create .env file with:
PORT=3000
MONGODB_URI=your_mongodb_string_here
MONGODB_NAME=News_Aggravator
NEWS_API_KEY=your_newsapi_key

npm start
```

### Frontend Setup
```bash
cd news-frontend
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📋 API Endpoints

- `GET /api/news/headlines` - Latest headlines
- `GET /api/saved` - Saved articles
- `GET /api/search` - Search articles

## 👨‍💻 Author

B Sudharshan - bharathisudharshan348@gmail.com
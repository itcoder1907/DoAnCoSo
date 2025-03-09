const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();
const port = 5000;

// Sử dụng CORS
app.use(cors());  

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Elasticsearch
const client = new Client({ node: 'http://localhost:9200' });

// Lấy phim mới cập nhật
app.get('/api/latest-movies', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
    if (response.data && response.data.length > 0) {
      res.json(response.data);
    } else {
      res.status(404).send('No movies found');
    }
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).send('Error fetching movies');
  }
});

// Lấy thông tin chi tiết phim
app.get('/api/movie/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await axios.get(`https://ophim1.com/phim/${slug}`);
    if (response.data) {
      res.json(response.data);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).send('Error fetching movie details');
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

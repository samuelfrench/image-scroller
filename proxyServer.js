const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/images', async (req, res) => {
  const { board, thread } = req.query;
  try {
    const response = await axios.get(`https://a.4cdn.org/${board}/thread/${thread}.json`);
    const imageUrls = response.data.posts
      .filter(post => post.tim && post.ext)
      .map(post => `https://i.4cdn.org/${board}/${post.tim}${post.ext}`);
    res.json(imageUrls);
  } catch (error) {
    res.status(500).send('Error fetching images');
  }
});

app.get('/image', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type']);
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
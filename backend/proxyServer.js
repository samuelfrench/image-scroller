const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Endpoint to scrape images from a 4chan thread
app.get("/scrape-images", async (req, res) => {
    const { board, thread } = req.query; // Expect ?board=xyz&thread=123
    if (!board || !thread) {
        return res.status(400).json({ error: "Board and thread are required." });
    }

    try {
        const response = await axios.get(
            `https://a.4cdn.org/${board}/thread/${thread}.json`
        );
        const posts = response.data.posts;

        const images = posts
            .filter(post => post.tim && post.ext) // Filter posts with images
            .map(post => `https://i.4cdn.org/${board}/${post.tim}${post.ext}`);

        res.json(images);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch images." });
    }
});

// Endpoint to get images from a specific thread
app.get('/images', async (req, res) => {
    const { board, thread } = req.query;
    try {
        const response = await axios.get(`https://a.4cdn.org/${board}/thread/${thread}.json`);
        const imageUrls = response.data.posts
            .filter(post => post.tim && post.ext)
            .map(post => `https://i.4cdn.org/${board}/${post.tim}${post.ext}`);
        res.json(imageUrls);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send('Error fetching images');
    }
});

// Endpoint to get a specific image
app.get('/image', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        res.send(Buffer.from(response.data, 'binary'));
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
});

// Endpoint to get post numbers from a specific thread
app.get('/post-numbers', async (req, res) => {
    const { board, thread } = req.query;
    try {
        const response = await axios.get(`https://a.4cdn.org/${board}/thread/${thread}.json`);
        const postNumbers = response.data.posts.map(post => post.no);
        res.json(postNumbers);
    } catch (error) {
        console.error('Error fetching post numbers:', error);
        res.status(500).send('Error fetching post numbers');
    }
});

// Endpoint to get thread numbers from a specific board
app.get('/thread-numbers', async (req, res) => {
    const { board } = req.query;
    try {
        const response = await axios.get(`https://a.4cdn.org/${board}/catalog.json`);
        const threadNumbers = response.data.flatMap(page => page.threads.map(thread => thread.no));
        res.json(threadNumbers);
    } catch (error) {
        console.error('Error fetching thread numbers:', error);
        res.status(500).send('Error fetching thread numbers');
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
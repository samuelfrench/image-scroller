const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
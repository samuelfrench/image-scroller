import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ImageScroller.css"; // Style for TikTok-like scroll

const ImageScroller = ({ board, thread }) => {
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/scrape-images?board=${board}&thread=${thread}`
                );
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }
        };

        fetchImages();
    }, [board, thread]);

    const fetchMoreData = () => {
        // For demo purposes, this just replicates data
        if (images.length > 0) {
            setImages([...images, ...images]);
        } else {
            setHasMore(false);
        }
    };

    return (
        <InfiniteScroll
            dataLength={images.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more images!</p>}
        >
            {images.map((img, index) => (
                <div key={index} className="image-container">
                    <img src={img} alt={`4chan thread image ${index}`} />
                </div>
            ))}
        </InfiniteScroll>
    );
};

export default ImageScroller;

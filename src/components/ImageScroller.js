import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ImageScroller.css"; // Style for TikTok-like scroll

const ImageScroller = ({ board, thread }) => {
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
            const response = await fetch(`http://localhost:3001/thread-numbers?board=${board}`);
            const threadNumbers = await response.json();
            let allImages = [];
            for (const threadNumber of threadNumbers) {
                const threadResponse = await fetch(`http://localhost:3001/images?board=${board}&thread=${threadNumber}`);
                const threadImages = await threadResponse.json();
                allImages = [...allImages, ...threadImages];
            }
            setImages(allImages);
            } catch (error) {
                console.error("Failed to fetch all images:", error);
            }
        };

        fetchAllImages();
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
            
        {images.length > 0 ? (
            images.map((url, index) => (
                <img key={index} src={`http://localhost:3001/image?url=${encodeURIComponent(url)}`} alt={`Image ${index}`} />
            ))
        ) : (
          <p>No images found.</p>
        )}
        </InfiniteScroll>
    );
};

export default ImageScroller;

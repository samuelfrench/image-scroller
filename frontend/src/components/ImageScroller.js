// filepath: /home/sam/4chan-image-scroller/frontend/src/components/ImageScroller.js
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ImageScroller.css"; // Style for TikTok-like scroll

const ImageScroller = () => {
    const [board, setBoard] = useState('g');
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [threadNumbers, setThreadNumbers] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchThreadNumbers = async () => {
            try {
                const response = await fetch(`${API_URL}/thread-numbers?board=${board}`);
                const threads = await response.json();
                setThreadNumbers(threads);
                setCurrentPage(0);
                setImages([]);
                setHasMore(true);
            } catch (error) {
                console.error("Failed to fetch thread numbers:", error);
            }
        };

        fetchThreadNumbers();
    }, [board, API_URL]);

    useEffect(() => {
        const fetchInitialImages = async () => {
            if (threadNumbers.length > 0) {
                try {
                    let allImages = [];
                    const threadsToFetch = threadNumbers.slice(0, 5);
                    for (const threadNumber of threadsToFetch) {
                        const threadResponse = await fetch(`${API_URL}/images?board=${board}&thread=${threadNumber}`);
                        const threadImages = await threadResponse.json();
                        allImages = [...allImages, ...threadImages];
                    }
                    setImages(allImages);
                    setCurrentPage(1);
                } catch (error) {
                    console.error("Failed to fetch initial images:", error);
                }
            }
        };

        fetchInitialImages();
    }, [threadNumbers, board, API_URL]);

    const fetchMoreData = async () => {
        if (currentPage * 5 >= threadNumbers.length) {
            setHasMore(false);
            return;
        }

        try {
            let moreImages = [];
            const threadsToFetch = threadNumbers.slice(currentPage * 5, (currentPage + 1) * 5);
            for (const threadNumber of threadsToFetch) {
                const threadResponse = await fetch(`${API_URL}/images?board=${board}&thread=${threadNumber}`);
                const threadImages = await threadResponse.json();
                moreImages = [...moreImages, ...threadImages];
            }
            setImages([...images, ...moreImages]);
            setCurrentPage(currentPage + 1);
        } catch (error) {
            console.error("Failed to fetch more images:", error);
        }
    };

    const handleShare = async (url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this image',
                    url: url
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            console.log("Web Share API is not supported in your browser.");
        }
    };

    return (
        <div className="image-scroller">
            <h1>Image Scroller</h1>
            <label htmlFor="board-selector">Select Board: </label>
            <select id="board-selector" value={board} onChange={(e) => setBoard(e.target.value)}>
                <option value="g">/g/ - Technology</option>
                <option value="v">/v/ - Video Games</option>
                {/* Add more boards as needed */}
            </select>
            <InfiniteScroll
                dataLength={images.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more images</p>}
            >
                <div className="images">
                    {images.map((url, index) => (
                        <div key={index} className="image-container">
                            <img src={`${API_URL}/image?url=${encodeURIComponent(url)}`} alt={`Image ${index}`} />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ImageScroller;
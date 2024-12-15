import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ImageScroller.css"; // Style for TikTok-like scroll

const ImageScroller = () => {
    const [board, setBoard] = useState('pol');
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [threadNumbers, setThreadNumbers] = useState([]);

    useEffect(() => {
        const fetchThreadNumbers = async () => {
            try {
                const response = await fetch(`http://localhost:3001/thread-numbers?board=${board}`);
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
    }, [board]);

    useEffect(() => {
        const fetchInitialImages = async () => {
            if (threadNumbers.length > 0) {
                try {
                    let allImages = [];
                    const threadsToFetch = threadNumbers.slice(0, 5);
                    for (const threadNumber of threadsToFetch) {
                        const threadResponse = await fetch(`http://localhost:3001/images?board=${board}&thread=${threadNumber}`);
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
    }, [threadNumbers, board]);

    const fetchMoreData = async () => {
        if (currentPage * 5 >= threadNumbers.length) {
            setHasMore(false);
            return;
        }

        try {
            let moreImages = [];
            const threadsToFetch = threadNumbers.slice(currentPage * 5, (currentPage + 1) * 5);
            for (const threadNumber of threadsToFetch) {
                const threadResponse = await fetch(`http://localhost:3001/images?board=${board}&thread=${threadNumber}`);
                const threadImages = await threadResponse.json();
                moreImages = [...moreImages, ...threadImages];
            }
            setImages([...images, ...moreImages]);
            setCurrentPage(currentPage + 1);
        } catch (error) {
            console.error("Failed to fetch more images:", error);
        }
    };

    return (
        <div className="image-scroller">
            <h1>Image Scroller</h1>
            <label htmlFor="board-selector">Select Board: </label>
            <select id="board-selector" value={board} onChange={(e) => setBoard(e.target.value)}>
                <option value="pol">/pol/ - Politically Incorrect</option>
                <option value="b">/b/ - Random</option>
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
                        <img key={index} src={`http://localhost:3001/image?url=${encodeURIComponent(url)}`} alt={`Image ${index}`} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ImageScroller;
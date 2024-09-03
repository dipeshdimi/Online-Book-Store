import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { FaStar, FaUser, FaRegHeart } from 'react-icons/fa';
import { AiFillAmazonCircle } from 'react-icons/ai';

import './BookGallery.css';

export default function BookGallery({ sectionTitle, apiEndpoint }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20; // Number of items per page
  const bookListRef = useRef(null); // Reference for the book list element

  // Initial fetch logic
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const endpoint = sectionTitle === 'Top 10 Books' ? apiEndpoint : `${apiEndpoint}?page=1&limit=${limit}`;
        const response = await axios.get(endpoint);
        console.log('Fetch response:', response.data); // Log the response

        if (sectionTitle === 'Top 10 Books') {
          setBooks(response.data);
        } else {
          setBooks(response.data);
          setPage(2); // Start from the next page for further fetches
          setHasMore(response.data.length === limit); // Check if more books are available
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [apiEndpoint, sectionTitle]); // Run this effect when apiEndpoint or sectionTitle changes

  // Pagination fetch for loading more books (only for non-"Top 10 Books" sections)
  useEffect(() => {
    if (page <= 1 || !hasMore || sectionTitle === 'Top 10 Books') return; // Prevent fetching if on the first page or no more books

    const fetchMoreBooks = async () => {
      setLoading(true);
      try {
        console.log(`Fetching page ${page}`); // Log the page number
        const response = await axios.get(`${apiEndpoint}?page=${page}&limit=${limit}`);
        console.log(`Fetch for page ${page}:`, response.data); // Log each subsequent fetch
        if (response.data.length > 0) {
          setBooks(prevBooks => [...prevBooks, ...response.data]);
          setHasMore(response.data.length === limit); // Check if more books are available
        } else {
          setHasMore(false); // If no data is returned, stop fetching
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreBooks();
  }, [page, apiEndpoint, sectionTitle]); // Only run this when the page changes and sectionTitle is not 'Top 10 Books'

  // Scroll event listener for horizontal scrolling (only for non-"Top 10 Books" sections)
  useEffect(() => {
    if (sectionTitle === 'Top 10 Books') return; // Skip scroll event listener for 'Top 10 Books'

    const handleScroll = () => {
      const element = bookListRef.current;

      // Adding a small tolerance (e.g., 1px) to handle floating-point precision issues
      if (element.scrollWidth - element.scrollLeft <= element.clientWidth + 1 && !loading && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const bookListElement = bookListRef.current;
    bookListElement.addEventListener('scroll', handleScroll);

    return () => bookListElement.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, sectionTitle]); // Only run this when the page changes and sectionTitle is not 'Top 10 Books'

  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className='book-slider'>
      <h3>{sectionTitle}</h3>
      <div className="book-list" ref={bookListRef}>
        {books.map((book, index) => (
          <div key={index} className="book-item">
            <img src={book.mainImage} alt={`Book ${index + 1}`} className="book-image" />
            <div className="book-number font-size-130">{index + 1}</div>
            <div className="book-details">
              <h4 className='font-size-16 book-title'>{book.bookName}</h4>
              <div className="icon-wrapper font-size-14">
                <AiFillAmazonCircle className='amazon-icon' />
                <FaStar className="star-icon" />
                <span style={{ textWrap: 'nowrap' }}>{book.aRating} | </span>
                <FaUser className="user-icon" />
                <span>{book.aReviews}</span>
              </div>
            </div>
            <button className="gallery-wishlist-button">
              <FaRegHeart className='heart-icon' />
              <span>Add to Wishlist</span>
            </button>
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {!hasMore && sectionTitle !== 'Top 10 Books' && <div className="no-more-data">No more books to display.</div>}
    </div>
  );
}

BookGallery.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
};

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { FaStar, FaUser, FaRegHeart } from 'react-icons/fa';
import { AiFillAmazonCircle } from 'react-icons/ai';

import './BookGallery.css';

export default function BookGallery({ sectionTitle, apiEndpoint }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiEndpoint}?page=${page}&limit=40`);
      setBooks(prevBooks => [...prevBooks, ...response.data]);
      setHasMore(response.data.length > 0);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleScroll = useCallback(() => {
    if (loaderRef.current) {
      const rect = loaderRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (loading && !books.length) return <div className="spinner"></div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className='book-slider'>
      <h3>{sectionTitle}</h3>
      <div className="book-list">
        {books.map((book, index) => (
          <div key={index} className="book-item">
            <img src={book.mainImage} alt={`Book ${index + 1}`} className="book-image" />
            <div className="book-number font-size-130">{index + 1}</div>
            <div className="book-details">
              <h4 className='font-size-16 book-title'>{book.bookName}</h4>
              <div className="icon-wrapper font-size-14">
                <AiFillAmazonCircle className='amazon-icon' />
                <FaStar className="star-icon" />
                <span>{book.aRating} | </span>
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
        <div className="spinner loader">Loading More Books...</div>
      </div>
      <div ref={loaderRef} className="loader"></div>
    </div>
  );
}

BookGallery.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
};

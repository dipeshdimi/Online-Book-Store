import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { FaStar, FaUser, FaRegHeart } from 'react-icons/fa';
import { AiFillAmazonCircle } from 'react-icons/ai';

import './BookGallery.css';

export default function BookGallery({ sectionTitle, apiEndpoint, showSeriesBooks, ageFilter, type='books', setShowSeriesBooks=null }) {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20; // Number of items per page
  const bookListRef = useRef(null);

  // Initial fetch logic
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let endpoint;
        if(sectionTitle==='Top 10 Books')
          endpoint = apiEndpoint;
        else if(sectionTitle==='')
          endpoint = apiEndpoint + '?seriesName=' + showSeriesBooks.replace(/ /g, '%20');
        else
          endpoint = `${apiEndpoint}?page=1&limit=${limit}&minAge=${ageFilter.minAge}&maxAge=${ageFilter.maxAge}`;

        const response = await axios.get(endpoint);

        if (sectionTitle === 'Top 10 Books' || sectionTitle==='') {
          setBooks(response.data);
        } else {
          setBooks(response.data);
          setPage(2);
          setHasMore(response.data.length === limit);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [apiEndpoint, sectionTitle, ageFilter, showSeriesBooks]);


  // Lazy Loading
  useEffect(() => {
    if (page <= 1 || !hasMore || sectionTitle === 'Top 10 Books' || sectionTitle==='') return;

    const fetchMoreBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiEndpoint}?page=${page}&limit=${limit}&minAge=${ageFilter.minAge}&maxAge=${ageFilter.maxAge}`);

        if (response.data.length > 0) {
          setBooks(prevBooks => [...prevBooks, ...response.data]);
          setHasMore(response.data.length === limit);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreBooks();
  }, [page, apiEndpoint, sectionTitle, ageFilter, hasMore]);

  // Scroll event listener
  useEffect(() => {
    if (sectionTitle === 'Top 10 Books' || sectionTitle==='') return;

    const handleScroll = () => {
      const element = bookListRef.current;

      // Tolerance
      if (element.scrollWidth - element.scrollLeft <= element.clientWidth + 1 && !loading && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const bookListElement = bookListRef.current;
    bookListElement.addEventListener('scroll', handleScroll);

    return () => bookListElement.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, sectionTitle]);

  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className='book-slider'>
      <h3>{sectionTitle}</h3>
      <div className="book-list" ref={bookListRef}>
        {books.map((book, index) => (
          <div key={index} className="book-item" onClick={() => setShowSeriesBooks(book.seriesName)}>
            <img src={book.mainImage} alt={`Book ${index + 1}`} className="book-image" />
            <div className="book-number font-size-130">{index + 1}</div>
            <div className="book-details">
              <h4 className='font-size-16 book-title'>{type === 'books' ? book.bookName : book.seriesName}</h4>
              {type === 'books' ?
                <div className="icon-wrapper font-size-14">
                  <AiFillAmazonCircle className='amazon-icon' />
                  <FaStar className="star-icon" />
                  <span style={{ textWrap: 'nowrap' }}>{book.aRating} | </span>
                  <FaUser className="user-icon" />
                  <span>{book.aReviews}</span>
                </div>
                :
                <span className='font-size-14'>{book.numberOfBooks} books</span>
              }
            </div>
            {type === 'books' &&
              <button className="gallery-wishlist-button">
                <FaRegHeart className='heart-icon' />
                <span>Add to Wishlist</span>
              </button>
            }
          </div>
        ))}
        {loading && <div className="loading">Loading...</div>}
      </div>
      {!hasMore && sectionTitle !== 'Top 10 Books' && <div className="no-more-data">No more books to display.</div>}
    </div>
  );
}

BookGallery.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  showSeriesBooks: PropTypes.string,
  ageFilter: PropTypes.shape({
    minAge: PropTypes.number.isRequired,
    maxAge: PropTypes.number.isRequired
  }).isRequired,
  type: PropTypes.oneOf(['books', 'series']),
  setShowSeriesBooks: PropTypes.func
};
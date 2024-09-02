import { FaStar, FaUser, FaRegHeart } from 'react-icons/fa';
import { AiFillAmazonCircle } from 'react-icons/ai';

import './BookGallery.css';

export default function BookGallery() {
  const books = [
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
    '/sample-book.png',
  ];

  return (
    <div className='book-slider'>
      <h3>Top 10 Books</h3>
      <div className="book-list">
        {books.map((book, index) => (
          <div key={book} className="book-item">
            <img src={book} alt={`Book ${index + 1}`} className="book-image" />
            <div className="book-number font-size-130">{index + 1}</div>
            <div className="book-details">
              <h4 className='font-size-16 book-title'>How to Catch a Turkey - Adam Wallace</h4>
              <div className="icon-wrapper font-size-14">
                <AiFillAmazonCircle className='amazon-icon' />
                <FaStar className="star-icon" />
                <span style={{ textWrap: 'nowrap' }}>4.3 | </span>
                <FaUser className="user-icon" />
                <span>1234</span>
              </div>
            </div>
            <button className="gallery-wishlist-button">
              <FaRegHeart className='heart-icon' />
              <span>Add to Wishlist</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { FaStar, FaUser, FaRegHeart } from 'react-icons/fa';
import { AiFillAmazonCircle } from 'react-icons/ai';

import './FeaturedTile.css';

export default function FeaturedTile() {
  return (
    <div className="featured-card">
      <img src='/sample-book.png' alt='Book' className='featured-book-img' />
      <div className='featured-card-info'>
        <div className="featured-card-tags font-size-12">
          <span className="featured-card-tag">Action-packed</span>
          <span className="featured-card-tag age-tag">3-8 years</span>
        </div>
        <div className="featured-card-details">
          <h2 className='font-size-24 featured-card-title'>How to Catch a Turkey - Adam Wallace</h2>
          <div className="icon-wrapper font-size-14">
            <AiFillAmazonCircle className='amazon-icon' />
            <FaStar className="star-icon" />
            <span>4.3 | </span>
            <FaUser className="user-icon" />
            <span>1234</span>
          </div>
          <p className='font-size-14'>All mamma wants on her special day is a little bit of peace, love, and cleanliness... Read more</p>
        </div>
        <button className="featured-wishlist-button">
          <FaRegHeart className='heart-icon' />
          <span>Add to Wishlist</span>
        </button>
      </div>
    </div>
  );
}

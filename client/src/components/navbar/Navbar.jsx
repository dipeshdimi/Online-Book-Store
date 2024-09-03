import { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { FaSearch, FaCaretDown } from 'react-icons/fa'

import './Navbar.css';

export default function Navbar() {
  const [selectedDate, setSelectedDate] = useState(Date.now());

  return (
    <div className="navbar font-size-14">
      <div className='navbar-logo-search-container'>
        <img src="/logo-dark.png" alt="Logo" className="navbar-logo" />
        <div className='search-wrapper'>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by author, title, age, genre..."
            className="navbar-search"
          />
        </div>
      </div>
      <nav className='navigation'>
        <a href="/" className="navbar-link">Home</a>
        <a href="/" className="navbar-link">Browse Library</a>
        <a href="/" className="navbar-link">Blog</a>
        <a href="/" className="navbar-link">My Books</a>
        <a href="/" className="navbar-link">Browse Library</a>
        <div className='next-delivery'>
          <label htmlFor='datepicker' className="navbar-link font-size-10 datepicker-label">
            Next Delivery
          </label>
          <div className='datepicker-wrapper'>
            <DatePicker
              id='datepicker'
              className='datepicker-input'
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="EEE, dd MMM"
            />
            <label htmlFor='datepicker'>
              <FaCaretDown htmlFor="datepicker" />
            </label>
          </div>
        </div>
        <img src='/user-icon.png' alt="User Profile" className="navbar-link" />
      </nav >
    </div >
  );
}

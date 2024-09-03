import { useState } from 'react';

import BookGallery from '../bookGallery/BookGallery';
import './Books.css';

export default function Books({ selectedAgeGroup }) {
  const BASE_API_URL = 'http://localhost:5000/api/sheets/';
  const SERIES_API_URL = 'http://localhost:5000/api/sheets/popular-series/';
  const BOOKS_BY_SERIES_BASE_URL = 'http://localhost:5000/api/sheets/series-books'

  const [showSeriesBooks, setShowSeriesBooks] = useState(null);

  return (
    <div className="Books">
      {selectedAgeGroup.maxAge === 100 &&
        <>
          <BookGallery
            sectionTitle="Top 10 Books"
            apiEndpoint={BASE_API_URL + "top-books"}
            ageFilter={selectedAgeGroup}
          />

          <div className="series">
            <BookGallery
              sectionTitle="Popular Series"
              apiEndpoint={SERIES_API_URL}
              ageFilter={{ minAge: 0, maxAge: 100 }}
              type='series'
              setShowSeriesBooks={setShowSeriesBooks}
            />
            {showSeriesBooks &&
              <BookGallery
                sectionTitle=""
                apiEndpoint={BOOKS_BY_SERIES_BASE_URL}
                ageFilter={{ minAge: 0, maxAge: 100 }}
                showSeriesBooks={showSeriesBooks}
              />
            }
          </div>

        </>
      }

      <BookGallery
        sectionTitle="New Arrivals"
        apiEndpoint={BASE_API_URL + "new-arrivals"}
        ageFilter={selectedAgeGroup}
      />
      <BookGallery
        sectionTitle="Bestsellers"
        apiEndpoint={BASE_API_URL + "best-sellers"}
        ageFilter={selectedAgeGroup}
      />
    </div>
  );
}

import BookGallery from '../bookGallery/BookGallery';
import './Books.css';

export default function Books() {
  const BASE_API_URL = 'http://localhost:5000/api/sheets/';
  return (
    <div className="Books">
      <BookGallery
        sectionTitle="Top 10 Books"
        apiEndpoint={BASE_API_URL+"top-books"}
      />
      <BookGallery
        sectionTitle="New Arrivals"
        apiEndpoint={BASE_API_URL+"new-arrivals"}
      />
      <BookGallery
        sectionTitle="Bestsellers"
        apiEndpoint={BASE_API_URL+"best-sellers"}
      />
    </div>
  );
}

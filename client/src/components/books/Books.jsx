import BookGallery from '../bookGallery/BookGallery';
import './Books.css';

function App() {
  const BASE_API_URL = 'http://localhost:5000/api/sheets/';
  return (
    <div className="App">
      <BookGallery
        sectionTitle="Popular Books"
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

export default App;
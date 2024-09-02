import Navbar from './components/navbar/Navbar';
import Featured from './components/featured/Featured';
import AgeGroup from './components/ageGroup/AgeGroup';
import Books from './components/books/Books';
import './App.css'

function App() {

  return (
    <div className='App'>
      <Navbar />
      <Featured />
      <AgeGroup />
      <Books />
    </div>
  )
}

export default App

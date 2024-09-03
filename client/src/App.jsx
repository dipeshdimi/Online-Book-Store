import { useState } from 'react';

import Navbar from './components/navbar/Navbar';
import Featured from './components/featured/Featured';
import AgeGroup from './components/ageGroup/AgeGroup';
import Books from './components/books/Books';
import Footer from './components/footer/Footer';

import './App.css'

function App() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState({minAge: 0, maxAge: 100});

  return (
    <div className='App'>
      <Navbar />
      <Featured selectedAgeGroup={selectedAgeGroup}/>
      <AgeGroup onAgeGroupChange={setSelectedAgeGroup} />
      <Books selectedAgeGroup={selectedAgeGroup} />
      <Footer />
    </div>
  )
}

export default App

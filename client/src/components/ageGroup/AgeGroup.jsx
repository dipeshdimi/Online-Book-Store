import { useState } from 'react';
import PropTypes from 'prop-types';

import { MdKeyboardArrowLeft } from "react-icons/md";

import './AgeGroup.css';

export default function AgeGroup({ onAgeGroupChange }) {
  const [activeButton, setActiveButton] = useState(null);
  const [ageGroupView, setAgeGroupView] = useState(false);

  const ageGroups = [
    ['/child-1.png'],
    ['0-1 years', '1-3 years'],
    ['/child-2.png'],
    ['3-6 years', '6-9 years'],
    ['/child-3.png'],
    ['9-12 years', '12+ years'],
    ['/child-4.png']
  ];

  const handleAgeGroupClick = (ageGroup, index) => {
    let minAge = ageGroup.split('-')[0], maxAge = 100;
    if (minAge === '12+') {
      minAge = 12;
    } else {
      minAge = Number(minAge);
      maxAge = Number(ageGroup.split('-')[1]);
    }

    setActiveButton(index);
    setAgeGroupView(true);
    onAgeGroupChange({ minAge, maxAge });
  };

  const handleBackClick = () => {
    onAgeGroupChange({minAge: 0, maxAge: 100});
    setAgeGroupView(false);
    setActiveButton(false);
  }


  return (
    !ageGroupView ? 
    <div className="age-group-container">
      <h2 className='age-group-title font-size-24'>Browse by Age Group</h2>
      <div className="age-group-list">
        {ageGroups.map((group, index) => (
          <div key={index} className="age-group-item">
            {index % 2 === 0 ?
              (<img src={group[0]} alt='Child Image' className="age-group-image" />)
              :
              (<div className='age-groups'>
                <button 
                  className={`age-group-label ${activeButton === index * 2 ? 'active' : ''}`}
                  onClick={() => handleAgeGroupClick(group[0], index * 2)}
                >
                  <h3 className='font-size-24'>{group[0].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[0].split(' ')[1]}</p>
                </button>
                <button 
                  className={`age-group-label ${activeButton === index * 2 + 1 ? 'active' : ''}`}
                  onClick={() => handleAgeGroupClick(group[1], index * 2 + 1)}
                >
                  <h3 className='font-size-24'>{group[1].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[1].split(' ')[1]}</p>
                </button>
              </div>)
            }
          </div>
        ))}
      </div>
    </div>
    :
    <div className="age-group-view">
      <div className='age-group-view-heading'>
        <MdKeyboardArrowLeft className='font-size-24' onClick={handleBackClick}/>
        <h2 className='font-size-24'>Browse by Age Group</h2>
      </div>
      {ageGroups.map((group, index) => (
          <>
            {index % 2 !== 0 &&
              <>
                <button 
                  className={`age-group-label ${activeButton === index * 2 ? 'active' : ''}`}
                  onClick={() => handleAgeGroupClick(group[0], index * 2)}
                >
                  <h3 className='font-size-24'>{group[0].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[0].split(' ')[1]}</p>
                </button>
                <button 
                  className={`age-group-label ${activeButton === index * 2 + 1 ? 'active' : ''}`}
                  onClick={() => handleAgeGroupClick(group[1], index * 2 + 1)}
                >
                  <h3 className='font-size-24'>{group[1].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[1].split(' ')[1]}</p>
                </button>
              </>
            }
          </>
        ))}
    </div>
  );
}

AgeGroup.propTypes = {
  onAgeGroupChange: PropTypes.func.isRequired
};
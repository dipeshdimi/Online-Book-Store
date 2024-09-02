import './AgeGroup.css';

export default function AgeGroupComponent() {
  const ageGroups = [
    ['/child-1.png'],
    ['0-1 years', '1-3 years'],
    ['/child-2.png'],
    ['3-6 years', '6-9 years'],
    ['/child-3.png'],
    ['9-12 years', '12+ years'],
    ['/child-4.png']
  ];

  return (
    <div className="age-group-container">
      <h2 className='age-group-title font-size-24'>Browse by Age Group</h2>
      <div className="age-group-list">
        {ageGroups.map((group, index) => (
          <div key={group[0]} className="age-group-item">

            {index % 2 === 0 ?
              (<img src={group[0]} alt='Child Image' className="age-group-image" />)
              :
              (<div className='age-groups'>
                <button className="age-group-label">
                  <h3 className='font-size-24'>{group[0].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[0].split(' ')[1]}</p>
                </button>
                <button className="age-group-label">
                  <h3 className='font-size-24'>{group[1].split(' ')[0]}</h3>
                  <p className='font-size-16'>{group[1].split(' ')[1]}</p>
                </button>
              </div>)
            }
          </div>
        ))}
      </div>
    </div>
  );
}

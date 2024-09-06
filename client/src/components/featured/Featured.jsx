import PropTypes from 'prop-types';

import FeaturedTile from './featuredTile/FeaturedTile';

import './Featured.css';

export default function Featured({ selectedAgeGroup }) {
  return (
    selectedAgeGroup.maxAge === 100 ? (
      <div className='featured'>
        <FeaturedTile />
        <FeaturedTile />
      </div>
    ) : null
  );
}

Featured.propTypes = {
  selectedAgeGroup: PropTypes.shape({
    minAge: PropTypes.number.isRequired,
    maxAge: PropTypes.number.isRequired
  }).isRequired
};

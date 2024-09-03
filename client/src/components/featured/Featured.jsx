import FeaturedTile from './featuredTile/FeaturedTile';
import './Featured.css';

export default function Featured({ selectedAgeGroup }) {
  return (
    selectedAgeGroup.maxAge === 100 ? (
      <div className='featured'>
        <FeaturedTile />
        <FeaturedTile />
        {/* <FeaturedTile /> */}
      </div>
    ) : null
  );
}

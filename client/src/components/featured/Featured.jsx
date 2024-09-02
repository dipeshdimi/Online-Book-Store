import FeaturedTile from './featuredTile/FeaturedTile';
import './Featured.css';

export default function Featured() {
  return (
    <div className='featured'>
      <FeaturedTile />
      <FeaturedTile />
      {/* <FeaturedTile /> */}
    </div>
  );
}
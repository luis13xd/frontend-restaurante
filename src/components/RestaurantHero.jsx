import './Restaurant.css';
import home from '../assets/home.jpg';

const RestaurantHero = () => {
  return (
    <div className="restaurant-hero" id='homeImage'>
      <img 
        src={home}
        alt="Restaurante Infusión" 
        className="restaurant-image"
        onError={(e) => {
          e.target.src = '/placeholder-restaurant.jpg';
        }}
      />
    </div>
  )
}

export default RestaurantHero
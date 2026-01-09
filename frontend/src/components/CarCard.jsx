import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car }) => {
    const {
        _id,
        brand,
        model,
        pricePerDay,
        location,
        image,
        rating = 4.5,
        reviewCount = 0,
        fuelType,
    } = car;

    return (
        <Link to={`/cars/${_id}`} className="car-card">
            <div className="car-card-image-wrapper">
                <img
                    src={image || 'https://via.placeholder.com/400x300?text=Car+Image'}
                    alt={`${brand} ${model}`}
                    className="car-card-image"
                />
                <div className="car-card-badge">{fuelType}</div>
            </div>

            <div className="car-card-content">
                <div className="car-card-header">
                    <h3 className="car-card-title">
                        {brand} {model}
                    </h3>
                    <div className="car-card-rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{rating.toFixed(1)}</span>
                        {reviewCount > 0 && (
                            <span className="car-card-reviews">({reviewCount})</span>
                        )}
                    </div>
                </div>

                <p className="car-card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                </p>

                <div className="car-card-footer">
                    <div className="car-card-price">
                        <span className="car-card-price-amount">₹{pricePerDay}</span>
                        <span className="car-card-price-period">/ day</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { carAPI } from '../services/api';
import './BrowseCarsPage.css';

const BrowseCarsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        minPrice: '',
        maxPrice: '',
        fuelType: '',
        carType: '',
    });

    useEffect(() => {
        fetchCars();
    }, [searchParams]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const queryFilters = {};
            if (filters.location) queryFilters.location = filters.location;
            if (filters.minPrice) queryFilters.minPrice = filters.minPrice;
            if (filters.maxPrice) queryFilters.maxPrice = filters.maxPrice;
            if (filters.fuelType) queryFilters.fuelType = filters.fuelType;

            const response = await carAPI.getAllCars(queryFilters);
            setCars(Array.isArray(response) ? response : response.cars || []);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
            // Use mock data
            setCars(getMockCars());
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        setFilters({
            location: '',
            minPrice: '',
            maxPrice: '',
            fuelType: '',
            carType: '',
        });
        setSearchParams({});
    };

    return (
        <div className="browse-page">
            <div className="container-wide">
                <div className="browse-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters-sidebar">
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button onClick={handleClearFilters} className="filters-clear">
                                Clear all
                            </button>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="Enter city or area"
                                className="form-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Price Range (per day)</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                    className="form-input"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Fuel Type</label>
                            <select
                                name="fuelType"
                                value={filters.fuelType}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Car Type</label>
                            <select
                                name="carType"
                                value={filters.carType}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>

                        <button onClick={handleApplyFilters} className="btn btn-primary" style={{ width: '100%' }}>
                            Apply Filters
                        </button>
                    </aside>

                    {/* Cars Grid */}
                    <main className="browse-content">
                        <div className="browse-header">
                            <h1 className="browse-title">Available Cars</h1>
                            <p className="browse-count">
                                {loading ? 'Loading...' : `${cars.length} cars available`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="cars-grid">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="skeleton-card"></div>
                                ))}
                            </div>
                        ) : cars.length > 0 ? (
                            <div className="cars-grid">
                                {cars.map((car) => (
                                    <CarCard key={car._id} car={car} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <h3>No cars found</h3>
                                <p>Try adjusting your filters or search in a different location</p>
                                <button onClick={handleClearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

// Mock data
const getMockCars = () => [
    {
        _id: '1',
        brand: 'Honda',
        model: 'City',
        pricePerDay: 1500,
        location: 'Mumbai, Maharashtra',
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
        rating: 4.8,
        reviewCount: 24,
        fuelType: 'Petrol',
    },
    {
        _id: '2',
        brand: 'Hyundai',
        model: 'Creta',
        pricePerDay: 2000,
        location: 'Delhi, NCR',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        rating: 4.7,
        reviewCount: 18,
        fuelType: 'Diesel',
    },
    {
        _id: '3',
        brand: 'Maruti',
        model: 'Swift',
        pricePerDay: 1200,
        location: 'Bangalore, Karnataka',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        rating: 4.6,
        reviewCount: 32,
        fuelType: 'Petrol',
    },
    {
        _id: '4',
        brand: 'Tata',
        model: 'Nexon',
        pricePerDay: 1800,
        location: 'Pune, Maharashtra',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
        rating: 4.9,
        reviewCount: 15,
        fuelType: 'Electric',
    },
    {
        _id: '5',
        brand: 'Mahindra',
        model: 'XUV700',
        pricePerDay: 2500,
        location: 'Hyderabad, Telangana',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
        rating: 4.8,
        reviewCount: 21,
        fuelType: 'Diesel',
    },
    {
        _id: '6',
        brand: 'Kia',
        model: 'Seltos',
        pricePerDay: 2200,
        location: 'Chennai, Tamil Nadu',
        image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=400',
        rating: 4.7,
        reviewCount: 19,
        fuelType: 'Petrol',
    },
];

export default BrowseCarsPage;

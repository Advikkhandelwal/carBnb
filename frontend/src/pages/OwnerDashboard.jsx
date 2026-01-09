import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carAPI, bookingAPI } from '../services/api';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [myCars, setMyCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'cars') {
                const response = await carAPI.getOwnerCars();
                setMyCars(response.cars || []);
            } else if (activeTab === 'bookings') {
                const response = await bookingAPI.getOwnerBookings();
                setBookings(response.bookings || []);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // Use mock data
            if (activeTab === 'cars') setMyCars(getMockCars());
            if (activeTab === 'bookings') setBookings(getMockBookings());
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!confirm('Are you sure you want to delete this car?')) return;

        try {
            await carAPI.deleteCar(carId);
            setMyCars(myCars.filter(car => car._id !== carId));
        } catch (error) {
            alert('Failed to delete car');
        }
    };

    const calculateEarnings = () => {
        return bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    };

    return (
        <div className="owner-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Owner Dashboard</h1>
                    <Link to="/add-car" className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Car
                    </Link>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cars')}
                    >
                        My Cars
                    </button>
                    <button
                        className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                    <button
                        className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('earnings')}
                    >
                        Earnings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="dashboard-content">
                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : activeTab === 'cars' ? (
                        <div className="cars-list">
                            {myCars.length === 0 ? (
                                <div className="empty-state">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <h3>No cars listed yet</h3>
                                    <p>Start earning by listing your first car</p>
                                    <Link to="/add-car" className="btn btn-primary">
                                        Add Your First Car
                                    </Link>
                                </div>
                            ) : (
                                myCars.map(car => (
                                    <div key={car._id} className="car-item">
                                        <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-item-image" />
                                        <div className="car-item-details">
                                            <h3>{car.brand} {car.model}</h3>
                                            <p className="car-item-location">{car.location}</p>
                                            <p className="car-item-price">₹{car.pricePerDay}/day</p>
                                        </div>
                                        <div className="car-item-actions">
                                            <Link to={`/edit-car/${car._id}`} className="btn btn-secondary btn-sm">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDeleteCar(car._id)} className="btn btn-outline btn-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : activeTab === 'bookings' ? (
                        <div className="bookings-list">
                            {bookings.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No bookings yet</h3>
                                    <p>Your booking requests will appear here</p>
                                </div>
                            ) : (
                                bookings.map(booking => (
                                    <div key={booking._id} className="booking-item">
                                        <div className="booking-info">
                                            <h4>{booking.car?.brand} {booking.car?.model}</h4>
                                            <p>Renter: {booking.renter?.name}</p>
                                            <p>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="booking-status">
                                            <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                            <p className="booking-price">₹{booking.totalPrice}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="earnings-view">
                            <div className="earnings-card">
                                <h3>Total Earnings</h3>
                                <p className="earnings-amount">₹{calculateEarnings()}</p>
                            </div>
                            <div className="earnings-stats">
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
                                    <div className="stat-label">Completed Bookings</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
                                    <div className="stat-label">Pending Requests</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{myCars.length}</div>
                                    <div className="stat-label">Active Listings</div>
                                </div>
                            </div>
                        </div>
                    )}
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
    },
];

const getMockBookings = () => [
    {
        _id: '1',
        car: { brand: 'Honda', model: 'City' },
        renter: { name: 'John Doe' },
        startDate: '2026-01-10',
        endDate: '2026-01-15',
        status: 'confirmed',
        totalPrice: 7500,
    },
];

export default OwnerDashboard;

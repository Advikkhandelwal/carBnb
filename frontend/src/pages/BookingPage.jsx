import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import './BookingPage.css';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // New Booking Flow State
    const [driverLicense, setDriverLicense] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [payment, setPayment] = useState({
        name: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    // Get booking data from navigation state
    const { car, startDate, endDate, totalPrice } = location.state || {};

    if (!car || !startDate || !endDate) {
        return (
            <div className="booking-page">
                <div className="container">
                    <div className="error-message">
                        <h2>Invalid Booking</h2>
                        <p>Missing booking information. Please select dates on the car details page.</p>
                        <button onClick={() => navigate('/browse')} className="btn btn-primary">
                            Browse Cars
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const calculateDays = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        if (diffMs <= 0) return 0;
        const hours = diffMs / (1000 * 60 * 60);
        return Math.max(1, Math.ceil(hours / 24));
    };

    const days = calculateDays();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDriverLicense(e.target.files[0]);
        }
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPayment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleAddPhone = async () => {
        if (!phoneNumber || phoneNumber.trim() === '') {
            alert('Please enter a valid phone number');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('phone', phoneNumber);
            // We need to preserve current name
            if (user.name) formData.append('name', user.name);

            const updatedUser = await userAPI.updateProfile(formData);
            updateUser(updatedUser);
            setShowPhoneModal(false);

            // Automatically proceed with booking
            await createBooking();
        } catch (error) {
            console.error('Failed to add phone:', error);
            alert('Failed to add phone number. Please try again.');
        }
    };

    const createBooking = async () => {
        setLoading(true);
        try {
            const bookingData = {
                carId: car.id || car._id,
                startDate,
                endDate,
                totalPrice,
            };

            const response = await bookingAPI.createBooking(bookingData);
            setBookingDetails(response);
            setBookingConfirmed(true);
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        // Validation Step 1: User Phone
        if (!user?.phone) {
            setShowPhoneModal(true);
            return;
        }

        // Validation Step 2: Driver's License
        if (!driverLicense) {
            alert("Please upload your Driver's License.");
            return;
        }

        // Validation Step 3: Payment
        if (!payment.cardNumber || !payment.expiry || !payment.cvv || !payment.name) {
            alert("Please complete payment details.");
            return;
        }

        // Validation Step 4: Terms
        if (!termsAccepted) {
            alert("You must agree to the Terms of Service.");
            return;
        }

        // All good, proceed
        await createBooking();
    };


    if (bookingConfirmed && bookingDetails) {
        return (
            <div className="booking-page">
                <div className="container">
                    <div className="booking-confirmation">
                        <div className="confirmation-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="confirmation-title">Booking Confirmed!</h1>
                        <p className="confirmation-subtitle">
                            Your booking request has been submitted successfully
                        </p>

                        {/* Map View - Ensuring it is visible as requested */}
                        {car.latitude && car.longitude && (
                            <div className="confirmation-map" style={{ marginBottom: '2rem' }}>
                                <h3>Pickup Location</h3>
                                <p style={{ marginBottom: '1rem', color: 'var(--color-gray-700)', fontSize: '0.9rem' }}>
                                    📍 {car.location}
                                </p>
                                <MapComponent
                                    cars={[car]}
                                    center={[car.latitude, car.longitude]}
                                    zoom={15}
                                />
                            </div>
                        )}

                        <div className="confirmation-card">
                            <div className="confirmation-status">
                                <span className={`status-badge ${bookingDetails.status || 'pending'}`}>
                                    {bookingDetails.status || 'PENDING'}
                                </span>
                            </div>

                            <div className="confirmation-details">
                                <h3>Booking Details</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Booking ID:</span>
                                    <span className="detail-value">{bookingDetails._id || bookingDetails.id || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Car:</span>
                                    <span className="detail-value">{car.brand} {car.model}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Dates:</span>
                                    <span className="detail-value">
                                        {new Date(startDate).toLocaleString()} - {new Date(endDate).toLocaleString()}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">{days} days</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Total Amount:</span>
                                    <span className="detail-value total-amount">₹{totalPrice}</span>
                                </div>
                            </div>

                            <div className="confirmation-info">
                                <div className="info-box">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                    <div>
                                        <h4>What's Next?</h4>
                                        <p>The car owner will review your booking request. You'll be notified once it's confirmed.</p>
                                        {bookingDetails.status === 'confirmed' && (
                                            <p className="contact-info">
                                                <strong>Owner Contact:</strong> {car.owner?.phone || 'Will be shared after confirmation'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="confirmation-actions">
                                <button onClick={() => navigate('/bookings')} className="btn btn-primary">
                                    View My Bookings
                                </button>
                                <button onClick={() => navigate('/')} className="btn btn-secondary">
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="container">
                <div className="booking-container">
                    <h1 className="booking-title">Complete Your Booking</h1>

                    <div className="booking-layout">
                        {/* Left: Booking Steps */}
                        <div className="booking-form-area">
                            {/* Car Summary */}
                            <div className="booking-car-details">
                                <div className="car-image">
                                    <img src={car.image} alt={`${car.brand} ${car.model}`} />
                                </div>
                                <div className="car-info">
                                    <h2>{car.brand} {car.model}</h2>
                                    <p className="car-location">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {car.location}
                                    </p>
                                    <div className="car-specs">
                                        <span className="spec-badge">{car.fuelType}</span>
                                        {car.engine && <span className="spec-badge">{car.engine}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Driver Verification */}
                            <div className="booking-form-section">
                                <h3>Driver Verification</h3>
                                <div className="file-upload" onClick={() => document.getElementById('license-upload').click()}>
                                    <input
                                        type="file"
                                        id="license-upload"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                    />
                                    <div className="upload-label">
                                        <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span>Click to upload Driver's License</span>
                                    </div>
                                </div>
                                {driverLicense && (
                                    <div className="uploaded-file" style={{ marginTop: '0.5rem' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{driverLicense.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Payment */}
                            <div className="booking-form-section">
                                <h3>Payment Details</h3>
                                <div className="form-full">
                                    <label className="form-label">Cardholder Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Name on Card"
                                        name="name"
                                        value={payment.name}
                                        onChange={handlePaymentChange}
                                    />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="0000 0000 0000 0000"
                                        name="cardNumber"
                                        value={payment.cardNumber}
                                        onChange={(e) => {
                                            const formatted = formatCardNumber(e.target.value);
                                            setPayment(prev => ({ ...prev, cardNumber: formatted }));
                                        }}
                                        maxLength="19"
                                    />
                                </div>
                                <div className="form-row">
                                    <div>
                                        <label className="form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="MM/YY"
                                            name="expiry"
                                            value={payment.expiry}
                                            onChange={handlePaymentChange}
                                            maxLength="5"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="123"
                                            name="cvv"
                                            value={payment.cvv}
                                            onChange={handlePaymentChange}
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="booking-form-section">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span>I agree to the Terms of Service and Cancellation Policy.</span>
                                </label>
                            </div>

                        </div>

                        {/* Right: Booking Summary sticky */}
                        <div className="booking-summary">
                            <h3>Booking Summary</h3>

                            <div className="summary-section">
                                <h4>Trip Details</h4>
                                <div className="summary-row">
                                    <span>Start Time</span>
                                    <span>{new Date(startDate).toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>End Time</span>
                                    <span>{new Date(endDate).toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Duration</span>
                                    <span>{days} days</span>
                                </div>
                            </div>

                            <div className="summary-section">
                                <h4>Price Breakdown</h4>
                                <div className="summary-row">
                                    <span>₹{car.pricePerDay} × {days} days</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                            >
                                {loading ? 'Processing...' : 'Pay & Confirm Booking'}
                            </button>

                            <p className="booking-note">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '4px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phone Number Modal */}
            {showPhoneModal && (
                <div className="modal-overlay" onClick={() => setShowPhoneModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Phone Number</h2>
                        <p>You need to add a phone number to book a car. This allows the car owner to contact you.</p>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="form-input"
                                placeholder="+91 98765 43210"
                                autoFocus
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setShowPhoneModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddPhone}
                                className="btn btn-primary"
                            >
                                Add Phone Number
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;

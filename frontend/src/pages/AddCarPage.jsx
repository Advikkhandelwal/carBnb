import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../services/api';
import './AddCarPage.css';

const AddCarPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        engine: '',
        fuelType: '',
        color: '',
        pricePerDay: '',
        location: '',
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            await carAPI.createCar(data);
            alert('Car added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to add car:', error);
            alert('Failed to add car. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-car-page">
            <div className="container">
                <div className="add-car-container">
                    <h1 className="page-title">List Your Car</h1>
                    <p className="page-subtitle">Fill in the details to start earning from your car</p>

                    <form onSubmit={handleSubmit} className="add-car-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="brand" className="form-label">
                                    Brand *
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Honda, Toyota"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="model" className="form-label">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., City, Fortuner"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="engine" className="form-label">
                                    Engine
                                </label>
                                <input
                                    type="text"
                                    id="engine"
                                    name="engine"
                                    value={formData.engine}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 1.5L i-VTEC"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fuelType" className="form-label">
                                    Fuel Type *
                                </label>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select fuel type</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="color" className="form-label">
                                    Color
                                </label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Silver, Black"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pricePerDay" className="form-label">
                                    Price Per Day (₹) *
                                </label>
                                <input
                                    type="number"
                                    id="pricePerDay"
                                    name="pricePerDay"
                                    value={formData.pricePerDay}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 1500"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location" className="form-label">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Mumbai, Maharashtra"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image" className="form-label">
                                Car Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                                className="form-input"
                                accept="image/*"
                            />
                            <p className="form-help">Upload an image of your car</p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Adding Car...' : 'Add Car'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCarPage;

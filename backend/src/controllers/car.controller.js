const carService = require("../services/car.service");

exports.getCars = async (req, res) => {
  try {
    // If query parameters exist (excluding empty ones), treat as search
    const hasFilters = Object.values(req.query).some(val => val && val.trim() !== '');

    if (hasFilters) {
      return exports.searchCars(req, res);
    }

    const cars = await carService.getAllCars();
    res.json(cars);
  } catch (error) {
    console.error("Error getting cars:", error);
    res.status(500).json({ error: "Failed to fetch cars", message: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCar(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    console.error("Error getting car:", error);
    res.status(500).json({ error: "Failed to fetch car", message: error.message });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const filters = req.query;
    const cars = await carService.searchCars(filters);
    res.json(cars);
  } catch (error) {
    console.error("Error searching cars:", error);
    res.status(500).json({ error: "Failed to search cars", message: error.message });
  }
};

exports.createCar = async (req, res) => {
  try {
    const { brand, model, engine, fuelType, color, pricePerDay, location, image } = req.body;
    const ownerId = req.user.id; // From authenticateToken middleware

    if (!brand || !model || !fuelType || !pricePerDay || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const carData = {
      brand,
      model,
      engine,
      fuelType,
      color,
      pricePerDay: parseFloat(pricePerDay),
      location,
      image,
      ownerId,
      // Note: Cars are immediately visible - no 'available' field needed
    };

    const newCar = await carService.createCar(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Failed to create car", message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const ownerId = req.user.id;

    // Authorization check
    const existingCar = await carService.getCar(carId);
    if (!existingCar) return res.status(404).json({ error: "Car not found" });
    if (existingCar.ownerId !== ownerId) return res.status(403).json({ error: "Unauthorized" });

    const updatedCar = await carService.updateCar(carId, req.body);
    res.json(updatedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car", message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const ownerId = req.user.id;

    // Authorization check
    const existingCar = await carService.getCar(carId);
    if (!existingCar) return res.status(404).json({ error: "Car not found" });
    if (existingCar.ownerId !== ownerId) return res.status(403).json({ error: "Unauthorized" });

    await carService.deleteCar(carId);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car", message: error.message });
  }
};

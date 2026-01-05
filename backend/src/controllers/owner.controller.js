const ownerService = require("../services/owner.service");

exports.addCar = async (req, res) => {
  try {
    const { brand, model, engine, fuelType, color, pricePerDay, location } = req.body;
    
    if (!brand || !model || !engine || !fuelType || !color || !pricePerDay || !location) {
      return res.status(400).json({ 
        error: "Missing required fields: brand, model, engine, fuelType, color, pricePerDay, location" 
      });
    }

    const ownerId = 1; // TODO: Get from auth middleware
    const car = await ownerService.addCar(ownerId, req.body);
    res.status(201).json(car);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Failed to add car", message: error.message });
  }
};

exports.getOwnerCars = async (req, res) => {
  try {
    const ownerId = 1; // TODO: Get from auth middleware
    const cars = await ownerService.getCars(ownerId);
    res.json(cars);
  } catch (error) {
    console.error("Error getting owner cars:", error);
    res.status(500).json({ error: "Failed to fetch owner cars", message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const ownerId = 1; // TODO: Get from auth middleware
    const car = await ownerService.updateCar(req.params.id, ownerId, req.body);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found or you don't have permission to update it" });
    }
    
    res.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car", message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const ownerId = 1; // TODO: Get from auth middleware
    const car = await ownerService.deleteCar(req.params.id, ownerId);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found or you don't have permission to delete it" });
    }
    
    res.json({ message: "Car deleted successfully", car });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car", message: error.message });
  }
};

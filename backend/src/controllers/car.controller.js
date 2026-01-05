const carService = require("../services/car.service");

exports.getCars = async (req, res) => {
  try {
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

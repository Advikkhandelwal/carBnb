const carService = require("../services/car.service");

exports.getCars = async (req, res) => {
  const cars = await carService.getAllCars();
  res.json(cars);
};

exports.getCarById = async (req, res) => {
  const car = await carService.getCar(req.params.id);
  res.json(car);
};

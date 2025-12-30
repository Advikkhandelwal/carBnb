const ownerService = require("../services/owner.service");

exports.addCar = async (req, res) => {
  const ownerId = 1; // TEMP
  const car = await ownerService.addCar(ownerId, req.body);
  res.status(201).json(car);
};

exports.getOwnerCars = async (req, res) => {
  const ownerId = 1;
  const cars = await ownerService.getCars(ownerId);
  res.json(cars);
};

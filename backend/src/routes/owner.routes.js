const router = require("express").Router();
const {
  addCar,
  getOwnerCars,
  updateCar,
  deleteCar,
} = require("../controllers/owner.controller");

router.post("/cars", addCar);
router.get("/cars", getOwnerCars);
router.put("/cars/:id", updateCar);
router.delete("/cars/:id", deleteCar);

module.exports = router;

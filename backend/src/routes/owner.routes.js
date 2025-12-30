const router = require("express").Router();
const {
  addCar,
  getOwnerCars,
} = require("../controllers/owner.controller");

router.post("/cars", addCar);
router.get("/cars", getOwnerCars);

module.exports = router;

const router = require("express").Router();
const { getCars, getCarById, searchCars } = require("../controllers/car.controller");

router.get("/search", searchCars);
router.get("/", getCars);
router.get("/:id", getCarById);

module.exports = router;

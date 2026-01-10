const router = require("express").Router();
const { getCars, getCarById, searchCars, createCar, updateCar, deleteCar } = require("../controllers/car.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.get("/search", searchCars);
router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/", authenticateToken, createCar);
router.put("/:id", authenticateToken, updateCar);
router.delete("/:id", authenticateToken, deleteCar);

module.exports = router;

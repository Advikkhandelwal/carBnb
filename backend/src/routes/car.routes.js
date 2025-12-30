const router = require("express").Router();
const { getCars, getCarById } = require("../controllers/car.controller");

router.get("/", getCars);
router.get("/:id", getCarById);

module.exports = router;

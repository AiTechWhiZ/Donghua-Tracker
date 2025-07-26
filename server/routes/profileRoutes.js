const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);

module.exports = router;

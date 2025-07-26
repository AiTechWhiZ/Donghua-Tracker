const express = require("express");
const router = express.Router();
const donghuaController = require("../controllers/donghuaController");
const statsController = require("../controllers/statsController");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", donghuaController.getAll);
router.post("/", donghuaController.create);
router.get("/stats", statsController.getStats);
router.get("/:id", donghuaController.getOne);
router.put("/:id", donghuaController.update);
router.delete("/:id", donghuaController.remove);

// Episode air date management routes
router.post("/:id/update-next-episode", donghuaController.updateNextEpisode);
router.post("/check-expired-episodes", donghuaController.checkExpiredEpisodes);

module.exports = router;

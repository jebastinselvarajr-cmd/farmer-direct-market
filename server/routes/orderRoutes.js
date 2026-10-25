const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  placeOrder,
  myOrders,
  farmerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/my", protect, myOrders);
router.get("/farmer", protect, farmerOrders);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;
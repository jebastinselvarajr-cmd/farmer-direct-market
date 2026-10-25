const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/mine", protect, getMyProducts); // /:id-ku MUNNADI
router.post("/", protect, addProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
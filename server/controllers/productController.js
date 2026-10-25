const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, farmer: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { farmer, ...data } = req.body; // farmer field-ah ignore pannu
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      data,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
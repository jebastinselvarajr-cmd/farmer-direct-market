const Order = require("../models/Order");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Delivery details check
    const a = deliveryAddress || {};
    if (!a.fullName || !a.phone || !a.street || !a.city || !a.pincode)
      return res.status(400).json({ message: "Please fill all delivery details" });
    if (!/^\d{10}$/.test(String(a.phone)))
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    if (!/^\d{6}$/.test(String(a.pincode)))
      return res.status(400).json({ message: "Pincode must be 6 digits" });

    let totalPrice = 0;
    const orderItems = [];

    // Pass 1: ellam check pannu
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.quantity < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      totalPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Pass 2: stock kuraikkalaam
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { quantity: -item.quantity } }
      );
    }

    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalPrice,
      deliveryAddress: {
        fullName: a.fullName,
        phone: String(a.phone),
        street: a.street,
        city: a.city,
        pincode: String(a.pincode),
      },
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.farmerOrders = async (req, res) => {
  try {
    if (req.user.role !== "farmer")
      return res.status(403).json({ message: "Only farmers can view this" });

    const products = await Product.find({ farmer: req.user.id }).select("_id");
    const ids = products.map((p) => p._id);
    const idSet = new Set(ids.map(String));

    const orders = await Order.find({ "items.product": { $in: ids } })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    const result = orders.map((o) => {
      const obj = o.toObject();
      obj.items = obj.items.filter((i) => idSet.has(String(i.product)));
      return obj;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "farmer")
      return res.status(403).json({ message: "Only farmers can update status" });

    const { status, expectedDelivery } = req.body;
    if (!["confirmed", "delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const mine = await Product.find({
      _id: { $in: order.items.map((i) => i.product) },
      farmer: req.user.id,
    });
    if (mine.length === 0)
      return res.status(403).json({ message: "Not your order" });

    if (status === "confirmed") {
      const date = new Date(expectedDelivery);
      if (!expectedDelivery || isNaN(date.getTime()))
        return res.status(400).json({ message: "Please select expected delivery date" });
      order.expectedDelivery = date;
    }
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
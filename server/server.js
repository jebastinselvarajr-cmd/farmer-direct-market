const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google / Cloudflare DNS
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

connectDB().then(() =>
  app.listen(process.env.PORT, () => console.log("Server running on port " + process.env.PORT))
);
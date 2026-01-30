require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const escapeHtml = require("escape-html");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// ===== Request logger (helps debugging) =====
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ===== Routes =====
const pasteRoutes = require("./routes/pasteRoutes");
const healthRoutes = require("./routes/healthRoutes");
const viewPasteHtmlRoutes = require("./routes/viewPasteHtmlRoutes");

app.use("/api/pastes", pasteRoutes);
app.use("/api/healthz", healthRoutes);
app.use("/p", viewPasteHtmlRoutes);

// ===== Central error handler =====
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (req.originalUrl.startsWith("/api")) {
    return res.status(status).json({ message });
  }

  res
    .status(status)
    .send(`<h1>${status}</h1><p>${escapeHtml(message)}</p>`);
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

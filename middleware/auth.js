const HttpError = require("../utils/Heper");
const jwt = require("jsonwebtoken");
// Middleware 404

const notFound = (req, res, next) => {
  next(new HttpError(404, "Không tìm thấy đường dẫn"));
};

// Middleware xử lý lỗi tổng quát
const errorHandler = (err, req, res, next) => {
  console.error("Lỗi:", err.message);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Đã xảy ra lỗi nội bộ",
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.userId;

    // ✅ Gán an toàn nếu req.body không tồn tại
    req.body = req.body || {};
    req.body.userId = decoded.userId;

    console.log("idUser: ", req.userId);
    next();
  });
};

module.exports = { notFound, errorHandler, verifyToken };

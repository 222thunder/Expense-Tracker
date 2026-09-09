export const notFound = (req, res, next) => {
  res.status(404).json({ message: "API route not found" });
};

export const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

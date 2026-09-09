export const mongoUri = process.env.MONGODB_URI || "";
export const port = process.env.PORT || 4000;
export const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
export const jwt_secret = process.env.JWT_SECRET || "";

export default { mongoUri, port, frontendUrl, jwt_secret };

export const mongoUri = process.env.MONGODB_URI || "";
export const port = process.env.PORT || 4000;
export const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
export const jwt_secret = process.env.JWT_SECRET || "";
export const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
export const clientSecret = process.env.CLIENT_SECRET || "";
export const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
export const googleUser = process.env.GOOGLE_USER || "";
export const cookieSecret = process.env.COOKIE_SECRET || "production";

export default {
  mongoUri,
  port,
  frontendUrl,
  jwt_secret,
  googleClientId,
  clientSecret,
  googleRefreshToken,
  googleUser,
  cookieSecret,
};

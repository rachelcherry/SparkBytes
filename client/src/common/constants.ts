export const API_URL: string =
  process.env.NODE_ENV === "production"
    ? "https://backend-production-316c.up.railway.app"
    : "http://localhost:5005";

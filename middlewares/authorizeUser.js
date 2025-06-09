import { verifyToken } from "../utils/utils.js";
import { getUserById } from "../services/users.js";

export function authenticateUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const token = auth.replace("Bearer ", "");
  const decodedToken = verifyToken(token);
  if (!decodedToken || !decodedToken.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
  req.user = decodedToken;
  next();
}

export async function authenticateAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  const user = await getUserById(req.user.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}

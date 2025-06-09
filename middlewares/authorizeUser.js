import { verifyToken } from "../utils/utils.js";

export function authenticateUser(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = verifyToken(token);
    if (decodedToken) {
      req.user = decodedToken;
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No token provided",
    });
  }
}

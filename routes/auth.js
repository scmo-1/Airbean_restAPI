import { Router } from "express";
import { registerUser, getUser } from "../services/users.js";
import {
  validateAuthBody,
  validateRegisterBody,
} from "../middlewares/validateLogin.js";
import { v4 as uuid } from "uuid";
import { setCart } from "../services/cart.js";
import { hashPassword, comparePasswords, signToken } from "../utils/utils.js";

const router = Router();

//GET logout
router.get("/logout", (req, res) => {
  global.user = null;
  res.json({
    success: true,
    message: "Logout successful",
  });
});

//POST register user
router.post("/register", validateRegisterBody, async (req, res, next) => {
  const { username, password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  const result = await registerUser({
    username: username,
    password: hashedPassword,
    userId: `user-${uuid().substring(0, 5)}`,
    role: role,
  });

  if (result) {
    setCart(result.userId);
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } else {
    next({
      status: 400,
      message: "registration unsuccessful",
    });
  }
});

//POST login
router.post("/login", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;

  const user = await getUser(username);
  if (user) {
    const correctPassword = await comparePasswords(password, user.password);
    if (correctPassword) {
      const token = signToken({ userId: user.userId });
      res.json({
        success: true,
        message: "Logged in successfully",
        token: `Bearer ${token}`,
      });
    } else {
      next({
        status: 400,
        message: "Wrong username or password",
      });
    }
  } else {
    next({
      status: 400,
      message: "No user found",
    });
  }
});

export default router;

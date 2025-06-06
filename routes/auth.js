import { Router } from "express";
import { registerUser, getUser } from "../services/users.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { v4 as uuid } from "uuid";
import { setCart } from "../services/cart.js";

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
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    const result = await registerUser({
      username: username,
      password: password,
      userId: `user-${uuid().substring(0, 5)}`,
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
  } else {
    next({
      status: 400,
      message: "username and password are required",
    });
  }
});

//POST login
router.post("/login", validateLogin, async (req, res, next) => {
  const { username, password } = req.body;

  const user = await getUser(username);
  if (user) {
    if (user.password === password) {
      global.user = user;
      res.json({
        success: true,
        message: "Logged in successfully",
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

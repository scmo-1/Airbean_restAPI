export function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || username.length < 6) {
    return next({
      status: 400,
      message: "Username is required and must be at least 6 characters",
    });
  }

  if (!password || password.length < 8) {
    return next({
      status: 400,
      message: "Password is required and must be at least 8 characters",
    });
  }

  next();
}

export function validateAuthBody(req, res, next) {
  if (req.body) {
    const { username, password } = req.body;
    if (username && password) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Both username AND password are required",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No body found in request",
    });
  }
}

export function validateRegisterBody(req, res, next) {
  if (req.body) {
    const { username, password, role } = req.body;
    if (username && password && role) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "All required data must be provided", // ändra meddelande?
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No body found in request",
    });
  }
}

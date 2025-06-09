import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/users.js";

export function calcTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calcTotalWithDiscount(items) {
  const unitPrices = [];

  items.forEach((item) => {
    for (let i = 0; i < item.qty; i++) {
      unitPrices.push(item.price);
    }
  });

  unitPrices.sort((a, b) => a - b);

  let total = 0;
  let discount = 0;

  for (let i = 0; i < unitPrices.length; i++) {
    if ((i + 1) % 3 === 0) {
      discount += unitPrices[i];
      continue;
    }
    total += unitPrices[i];
  }

  const totalBeforeDiscount = unitPrices.reduce((sum, price) => sum + price, 0);

  return {
    totalBeforeDiscount,
    discount,
    total,
  };
}

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function comparePasswords(password, hashedPassword) {
  const isSame = await bcrypt.compare(password, hashedPassword);
  return isSame;
}

export function signToken(payload) {
  const token = jwt.sign(payload, process.env.ENCRYPTION, {
    expiresIn: 60 * 60,
  });
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.ENCRYPTION);
    return decoded;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getUserFromRequest(req) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = verifyToken(token);
    const user = await getUserById(decodedToken.userId);

    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
}

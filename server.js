import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import menuRouter from "./routes/menu.js";
import ordersRouter from "./routes/orders.js";
import errorHandler from "./middlewares/errorHandler.js";
import swaggerUI from "swagger-ui-express";
import { parse } from "yaml";
import fs from "fs";

//config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

const file = fs.readFileSync("./docs/docs.yml", "utf8");
const swaggerDocs = parse(file);

//middlewares
app.use(express.json());

//routes
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);

database.on("error", (error) => console.log(error));
database.once("connected", () => {
  console.log(" ✅ DB connected");
  app.listen(PORT, () => {
    console.log(` 🚀 Server is running on port ${PORT}`);
  });
});

app.use(errorHandler);

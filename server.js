import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import menuRouter from "./routes/menu.js";
import ordersRouter from "./routes/orders.js";
import errorHandler from "./middlewares/errorHandler.js";

//config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);

database.on("error", (error) => console.log(error));
database.once("connected", () => {
  console.log("DB connected");
  app.listen(PORT, //flyttet parentesen for å sikre at serveren starter først etter at databasen er koblet til. Krasjet ellers.
    () => {
      console.log(`Server is running on port ${PORT}`);
    });
});

app.use(errorHandler);

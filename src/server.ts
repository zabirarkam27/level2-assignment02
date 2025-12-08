import express, { Request, Response } from "express";
import initDB from "./config/db";
import config from "./config";
import logger from "./middlewares/logger";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
const port = config.port;

// Parser
app.use(express.json());

// Initialize Database
initDB()

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Lui Eye Kan");
});

app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

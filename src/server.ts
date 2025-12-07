import express, { Request, Response } from "express";
import initDB from "./config/db";
import config from "./config";
import logger from "./middlewares/logger";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";

const app = express();
const port = config.port;

// Middleware
app.use(express.json());

initDB()
.then(() => console.log("Database initialized successfully"))
.catch((err: Error) => console.error("DB Initialization error:", err));

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Lui Eye Kan");
});

app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/bookings", bookingRoutes);


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

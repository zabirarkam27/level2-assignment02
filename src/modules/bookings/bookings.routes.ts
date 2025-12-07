import express from "express";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

export const bookingRoutes = router;

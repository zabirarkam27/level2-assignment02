import express from "express";
import { bookingController } from "./bookings.controller";
import auth from "../../middlewares/auth";

const router = express.Router();


router.post("/", auth(), bookingController.createBooking);
router.get("/", auth(), bookingController.getAllBookings);
router.get("/:bookingId", auth(), bookingController.getBookingById);
router.put("/:bookingId", auth(), bookingController.updateBooking);

export const bookingRoutes = router;

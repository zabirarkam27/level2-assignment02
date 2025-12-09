import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.createBooking({
      ...req.body,
      customer_id: req.user!.id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      if (req.user!.role === "customer") {
        const result = await bookingsService.getBookingByUserId(req.user.id);
        return res.status(200).json({
          success: true,
          message: "Bookings fetched successfully",
          data: result,
        });
      }
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admins only",
      });
    }

    const result = await bookingsService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.bookingId as string);
  try {
    const result = await bookingsService.getBookingById(id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    if (req.user.role === "customer" && req.user.id !== result.customer_id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Cannot access this booking",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const id = parseInt(req.params.bookingId as string);

  try {
    const booking = await bookingsService.getBookingById(id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Admin restrictions
    if (req.user.role === "admin") {
      // Admin can only mark returned
      if (req.body.status !== "returned") {
        return res.status(400).json({
          success: false,
          message: "Admins can only mark bookings as returned",
        });
      }
    }

    // Customer restrictions
    if (req.user.role === "customer") {
      if (req.user.id !== booking.customer_id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Cannot update this booking",
        });
      }

      // Customer can only cancel before start date
      const now = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (now >= startDate) {
        return res.status(400).json({
          success: false,
          message: "You can cancel only before the rental start date",
        });
      }

      // Customer always sets status to "cancelled"
      req.body.status = "cancelled";
    }

    const updated = await bookingsService.updateBooking(id, req.body);

    if (!updated) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update booking" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
};

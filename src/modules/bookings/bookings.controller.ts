import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {

  try {
    const result = await bookingsService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await bookingsService.getBookingById(id as string);

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.updateBooking(req.body);

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await bookingsService.deleteBooking(id as string);

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
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
  deleteBooking,
};

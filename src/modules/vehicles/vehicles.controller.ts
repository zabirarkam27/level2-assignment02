import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";
import { bookingsService } from "../bookings/bookings.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: result,
    });
  } catch (err: any) {
    if (err.code === '23505') {
        return res.status(400).json({ success: false, message: "Registration number already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    // Service now returns the array of rows directly
    const result = await vehiclesService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
const id = parseInt(req.params.vehicleId!);
  try {
    const result = await vehiclesService.getVehicleById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const id = parseInt(req.params.vehicleId!);

  try {
    const result = await vehiclesService.updateVehicle(id, req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (err: any) {
    if (err.code === '23505') {
        return res.status(400).json({ success: false, message: "Registration number already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
const id = parseInt(req.params.vehicleId!);
  try {

const activeBookings = await bookingsService.getBookingsByVehicleId(id, 'active');

    if (activeBookings.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete vehicle with active bookings",
        });
    }

    const result = await vehiclesService.deleteVehicle(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

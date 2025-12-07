import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await vehiclesService.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await vehiclesService.getVehicleById(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await vehiclesService.updateVehicle(
      id  as string,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await vehiclesService.deleteVehicle(id  as string);

    if (result.rowCount === 0) {
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

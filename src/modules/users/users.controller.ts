import { Request, Response } from "express";
import { usersService } from "./users.service";
import { bookingsService } from "../bookings/bookings.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const targetUserId = Number(req.params.userId);
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (requester.role !== "admin" && requester.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Cannot access this user",
      });
    }

    const result = await usersService.getUserById(String(targetUserId));

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User fetched successfully", data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const targetUserId = Number(req.params.userId);
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (requester.role === "customer" && requester.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }

    if (
      requester.role === "customer" &&
      req.body.role &&
      req.body.role !== requester.role
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Customers cannot change their role",
      });
    }

    const updatedUser = await usersService.updateUser(
      String(targetUserId),
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const targetUserId = Number(req.params.userId);

    const activeBookings =
      await bookingsService.getBookingByUserId(targetUserId);

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings",
      });
    }

    const deleted = await usersService.deleteUser(String(targetUserId));

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

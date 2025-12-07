import { Request, Response } from "express";
import { usersService } from "./users.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await usersService.createUser(name, email, password, phone, role);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getUserById(req.params.id as string);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await usersService.updateUser(
      req.params.id as string,
      name,
      email,
      password,
      phone,
      role
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await usersService.deleteUser(req.params.id as string);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

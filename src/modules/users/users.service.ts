import { pool } from "../../config/pool";
import bcrypt from "bcryptjs";

// Create user
const createUser = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  return await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
};

// Get all users
const getAllUsers = async () => {
  return await pool.query(`SELECT * FROM users`);
};

// Get user by ID
const getUserById = async (id: string) => {
  return await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
};

// Update user
const updateUser = async (payload: Record<string, any>) => {
  const { id, name, email, password, phone, role } = payload;



  return await pool.query(
    `UPDATE users
     SET name=$1, email=$2, password=$3, phone=$4, role=$5
     WHERE id=$6 RETURNING *`,
    [name, email, password, phone, role, id]
  );
};

// Delete user
const deleteUser = async (id: string) => {
  return await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
};

export const usersService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

import { pool } from "../../config/pool";
import bcrypt from "bcryptjs";

interface UserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: "admin" | "customer";
}

// Create user
const createUser = async (payload: UserPayload) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email?.toLowerCase(), hashedPassword, phone, role || "customer"]
  );

  return result.rows[0];
};

// Get all users
const getAllUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result.rows;
};

// Get single user
const getUserById = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id=$1`,
    [id]
  );
  return result.rows[0];
};

// Update user
const updateUser = async (id: string, payload: UserPayload) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const result = await pool.query(
    `UPDATE users
     SET
       name = COALESCE($1, name),
       email = COALESCE($2, email),
       password = COALESCE($3, password),
       phone = COALESCE($4, phone),
       role = COALESCE($5, role)
     WHERE id=$6
     RETURNING id, name, email, phone, role`,
    [name, email?.toLowerCase(), hashedPassword, phone, role, id]
  );

  return result.rows[0];
};

// Delete user
const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id`, [id]);
  return result.rows[0];
};

export const usersService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

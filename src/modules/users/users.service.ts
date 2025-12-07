import { pool } from "../../config/pool";

const createUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  return await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, password, phone, role]
  );
};

const getAllUsers = async () => {
  return await pool.query(`SELECT * FROM users`);
};

const getUserById = async (id: string) => {
  return await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
};

const updateUser = async (
  id: string,
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  return await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5
     WHERE id=$6 RETURNING *`,
    [name, email, password, phone, role, id]
  );
};

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

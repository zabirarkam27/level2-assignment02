import { pool } from "../../config/pool";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

const signupUser = async (payload: SignupPayload) => {
  const { name, email, password, phone, role } = payload;

  // check if email exists
  const exists = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (exists.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } };
};

export const authServices = { signupUser, signinUser };

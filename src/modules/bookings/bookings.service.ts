import { pool } from "../../config/pool";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
  status: string
) => {
  return await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]
  );
};

const getAllBookings = async () => {
  return await pool.query(`SELECT * FROM bookings`);
};

const getBookingById = async (id: string) => {
  return await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
};

const updateBooking = async (
  id: string,
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
  status: string
) => {
  return await pool.query(
    `UPDATE bookings
     SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6
     WHERE id=$7 RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      id,
    ]
  );
};

const deleteBooking = async (id: string) => {
  return await pool.query(`DELETE FROM bookings WHERE id=$1`, [id]);
};

export const bookingsService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};

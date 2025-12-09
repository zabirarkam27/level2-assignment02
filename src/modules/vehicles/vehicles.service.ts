import { pool } from "../../config/pool";
import { Vehicle } from "../../types/vehicle.types";

interface VehiclePayload {
  vehicle_name?: string;
  type?: 'car' | 'bike' | 'van' | 'SUV';
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: 'available' | 'booked';
}

// Create vehicle
const createVehicle = async (payload: VehiclePayload) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status = 'available' } = payload;

  const result = await pool.query<Vehicle>(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result.rows[0];
};

// Get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query<Vehicle>(`SELECT * FROM vehicles`);
  return result.rows;
};

// Get vehicle by ID
const getVehicleById = async (id: number) => {
  const result = await pool.query<Vehicle>(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

// Update vehicle
const updateVehicle = async (id: number, payload: VehiclePayload) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query<Vehicle>(
    `UPDATE vehicles
      SET
        vehicle_name = COALESCE($1, vehicle_name),
        type = COALESCE($2, type),
        registration_number = COALESCE($3, registration_number),
        daily_rent_price = COALESCE($4, daily_rent_price),
        availability_status = COALESCE($5, availability_status)
      WHERE id=$6
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );
  return result.rows[0];
};

// Delete vehicle
const deleteVehicle = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING id`, [id]);
  return result.rows[0];
};

export const vehiclesService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

import { pool } from "../../config/pool";

// Create vehicle
const createVehicle = async (payload: Record<string, any>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  return await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
};

// Get all vehicles
const getAllVehicles = async () => {
  return await pool.query(`SELECT * FROM vehicles`);
};

// Get vehicle by ID
const getVehicleById = async (id: string) => {
  return await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
};

// Update vehicle
const updateVehicle = async (payload: Record<string, any>) => {
  const { id, vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  return await pool.query(
    `UPDATE vehicles
     SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
     WHERE id=$6 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );
};

// Delete vehicle
const deleteVehicle = async (id: string) => {
  return await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
};

export const vehiclesService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

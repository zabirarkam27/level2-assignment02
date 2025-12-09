import { pool } from "../../config/pool";
import { Booking } from "../../types/booking.types";
import calculateDuration from "../../utils/calculate-duration";
import { vehiclesService } from "../vehicles/vehicles.service";

interface CreateBookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

calculateDuration;

// Create booking
const createBooking = async (
  payload: CreateBookingPayload
): Promise<Booking> => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // 1. Vehicle availability validation
  const vehicle = await vehiclesService.getVehicleById(vehicle_id);
  if (!vehicle || vehicle.availability_status === "booked") {
    throw new Error("Vehicle is currently unavailable or not found.");
  }

  // 2. Calculate Total Price
  const durationDays = calculateDuration(rent_start_date, rent_end_date);
  const dailyPrice = vehicle.daily_rent_price;
  const totalPrice = dailyPrice * durationDays;

  // 3. Create Booking
  const bookingResult = await pool.query<Booking>(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  // 4. Update Vehicle status to 'booked'
  await vehiclesService.updateVehicle(vehicle_id, { availability_status: "booked" });

  if (!bookingResult.rows[0]) {
    throw new Error("Failed to create booking");
  }

  return bookingResult.rows[0] as Booking;
};

// Get all bookings
const getAllBookings = async (customerId?: number): Promise<Booking[]> => {
  let query = `SELECT * FROM bookings`;
  const params: (string | number)[] = [];

  if (customerId) {
    query += ` WHERE customer_id = $1`;
    params.push(customerId);
  }

  const result = await pool.query<Booking>(query, params);
  return result.rows;
};

// Get single booking by ID
const getBookingById = async (id: number): Promise<Booking | undefined> => {
  const result = await pool.query<Booking>(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const getBookingByUserId = async (
  userId: number,
  status: "active" | "cancelled" | "returned" = "active"
): Promise<Booking[]> => {
  const result = await pool.query<Booking>(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = $2`,
    [userId, status]
  );
  return result.rows;
};

// Get active bookings by vehicle ID
const getBookingsByVehicleId = async (
  vehicleId: number,
  status: "active" | "cancelled" | "returned" = "active"
): Promise<Booking[]> => {
  const result = await pool.query<Booking>(
    `SELECT id FROM bookings WHERE vehicle_id=$1 AND status=$2`,
    [vehicleId, status]
  );
  return result.rows;
};

// Update booking (used for Cancel/Return)
interface UpdateBookingPayload {
  status?: "cancelled" | "returned";
}
const updateBooking = async (
  id: number,
  payload: UpdateBookingPayload
): Promise<Booking | undefined> => {
  const { status } = payload;

  const result = await pool.query<Booking>(
    `UPDATE bookings
        SET status = COALESCE($1, status)
        WHERE id = $2
        RETURNING *`,
    [status, id]
  );

  const updatedBooking = result.rows[0];

  // Update vehicle status if returned or cancelled
  if (updatedBooking && (status === "returned" || status === "cancelled")) {
    await vehiclesService.updateVehicle(updatedBooking.vehicle_id, {
      availability_status: "available",
    });
  }

  return updatedBooking;
};



export const bookingsService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  getBookingByUserId,
  getBookingsByVehicleId,
};

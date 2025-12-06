import { pool } from "./pool";

const initDB = async () => {

  // Users table
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'customer');
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL,
      phone VARCHAR(15) NOT NULL,
      role user_role NOT NULL DEFAULT 'customer'
    );
 `);

//  Vehicles table
 await pool.query(`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
        CREATE TYPE vehicle_type AS ENUM ('car','bike','van','SUV');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
        CREATE TYPE availability_status AS ENUM ('available','booked');
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(200) NOT NULL,
      type vehicle_type NOT NULL,
      registration_number VARCHAR(100) NOT NULL UNIQUE,
      daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status	availability_status NOT NULL DEFAULT 'available',
      created_at TIMESTAMP DEFAULT now()
    );
  `)

//  Bookings table
 await pool.query(`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE
      typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('active','cancelled','returned');
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
      status booking_status NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT now(),
      CHECK (rent_end_date > rent_start_date)
    );
  `)
};

export default initDB;

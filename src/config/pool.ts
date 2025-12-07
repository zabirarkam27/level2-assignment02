import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../config';

dotenv.config()

export const pool = new Pool({
  connectionString: config.connection_str
});
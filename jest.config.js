import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load.env file
dotenv.config({ path: path.resolve(__dirname, './server/.env') });

export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {},
  
};

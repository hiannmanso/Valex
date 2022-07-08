import dotenv from "dotenv";
import pg from "pg";
import chalk from 'chalk'

dotenv.config();

const { Pool } = pg;
export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log(chalk.bold.italic.blue(`Postegres database connected.`))
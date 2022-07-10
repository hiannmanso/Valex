import { connection } from "../../database.js";

export interface Company {
  id: number;
  name: string;
  apiKey?: string;
}

 async function findByApiKey(apiKey: string) {
  const result = await connection.query<Company, [string]>(
    `SELECT * FROM companies WHERE "apiKey"=$1`,
    [apiKey]
  );

  return result.rows[0];
}

const companyRepository ={
  findByApiKey,
}
export default companyRepository


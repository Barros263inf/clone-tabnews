import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValue(),
  });

  try {
    await client.connect();
  } catch (error) {
    console.log(error);
    throw error;
  }

  try {
    const response = await client.query(queryObject);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

function getSSLValue() {
  if (process.env.POSTGRES_CA) {
    return process.env.POSTGRES_CA;
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

export default {
  query: query,
};

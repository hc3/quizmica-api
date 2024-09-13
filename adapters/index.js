const Redis = require('ioredis');
const { Pool } = require('pg');

function Postgresql(pool) {
  this.execute = async function (name, sql, parameters) {
    try {
      const result = await pool.query(sql, parameters);
      return result.rows;
    } catch (err) {
      console.error(`Error executing query ${name}:`, err);
      throw err;
    }
  };
}

function Adapters() {
  let redisInstance = null;
  let postgresInstance = null;

  function getSQLAdapter() {
    if (!postgresInstance) {
      postgresInstance = new Pool({
        user: "igcvgmrl",
        host: "baasu.db.elephantsql.com",
        database: "igcvgmrl",
        password: "liicv8hNAwb5W6lczlSdkKc5ytf_uep0",
        port: 5432,
      });
    }
    return new Postgresql(postgresInstance);
  }

  function getCacheAdapter() {
    if (!redisInstance) {
      redisInstance = new Redis({
        host: "localhost",
        port: 6379,
      });
    }
    return redisInstance;
  }

  return {
    getSQLAdapter,
    getCacheAdapter,
  };
}

module.exports = Adapters();

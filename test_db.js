const { Client } = require("pg");

const client = new Client({
  connectionString: "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres", // removed sslmode=require
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected");
    const res = await client.query("SELECT * FROM reports");
    console.log("Reports:", res.rows);
    await client.end();
  } catch(e) {
    console.error("DB Error:", e);
  }
}
run();

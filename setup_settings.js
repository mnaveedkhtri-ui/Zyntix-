const { Client } = require("pg");
const fs = require("fs");

const client = new Client({
  connectionString: "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const sql = fs.readFileSync("create_settings.sql", "utf8");
  await client.query(sql);
  console.log("Settings table created and URL saved!");
  const res = await client.query("SELECT * FROM settings;");
  console.log("Current settings:", res.rows);
  await client.end();
}
run().catch(console.error);

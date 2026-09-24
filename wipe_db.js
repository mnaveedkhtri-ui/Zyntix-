const { Client } = require("pg");

const client = new Client({
  connectionString: "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB. Deleting all test reports...");
    const res = await client.query("DELETE FROM reports;");
    console.log("Deleted rows:", res.rowCount);
    await client.end();
  } catch(e) {
    console.error("DB Error:", e);
  }
}
run();

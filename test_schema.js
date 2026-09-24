const { Client } = require("pg");
let connStr = "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
connStr = connStr.replace("?sslmode=require", "");
const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
  const res = await client.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'id'");
  console.log(res.rows[0].data_type);
  client.end();
}).catch(console.error);

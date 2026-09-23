require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function freshSeed() {
  console.log("🚀 Memulai proses Fresh Seed...");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL tidak ditemukan di .env.local");
    console.log("💡 Silakan tambahkan DATABASE_URL ke .env.local (ambil dari Supabase Dashboard -> Settings -> Database -> Connection string -> URI)");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Terhubung ke database Supabase.");

    // 1. Jalankan schema.sql
    console.log("⏳ Menjalankan schema.sql...");
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log("✅ schema.sql berhasil dijalankan (Tabel dan data di-reset).");

    // 2. Jalankan seed-user.sql
    console.log("⏳ Menjalankan seed-user.sql...");
    const userPath = path.join(__dirname, '../supabase/seed-user.sql');
    const userSql = fs.readFileSync(userPath, 'utf8');
    await client.query(userSql);
    console.log("✅ seed-user.sql berhasil dijalankan (User admin di-reset).");

    console.log("\n🎉 Fresh Seed Selesai!");
  } catch (err) {
    console.error("❌ Terjadi kesalahan saat menjalankan SQL:", err.message);
  } finally {
    await client.end();
  }
}

freshSeed();

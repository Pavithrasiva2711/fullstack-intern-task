
const db = require('./database');

async function migrate() {
  try {
    await db.migrate.latest();
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

migrate();

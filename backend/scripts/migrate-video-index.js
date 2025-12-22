/**
 * Migration script to remove unique index on videos
 * 
 * This allows users to upload the same YouTube video multiple times.
 * 
 * Run this once after deploying the updated code:
 * node scripts/migrate-video-index.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notebook_db';

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('videos');

    // Drop the unique index if it exists
    try {
      await collection.dropIndex('youtubeId_1_uploadedBy_1');
      console.log('✅ Dropped unique index on youtubeId_1_uploadedBy_1');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Index does not exist (already removed or never created)');
      } else {
        throw error;
      }
    }

    // Create a non-unique index for performance
    await collection.createIndex({ youtubeId: 1, uploadedBy: 1 });
    console.log('✅ Created non-unique index on youtubeId_1_uploadedBy_1');

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();


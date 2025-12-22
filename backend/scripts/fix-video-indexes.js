/**
 * Script to fix Video model indexes
 * Run this once to drop old unique indexes and create the new compound index
 * 
 * Usage: node scripts/fix-video-indexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

async function fixIndexes() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('videos');

    // Drop old unique indexes
    try {
      await collection.dropIndex('youtubeUrl_1');
      console.log('✅ Dropped youtubeUrl_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  youtubeUrl_1 index does not exist (already dropped)');
      } else {
        throw err;
      }
    }

    try {
      await collection.dropIndex('youtubeId_1');
      console.log('✅ Dropped youtubeId_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  youtubeId_1 index does not exist (already dropped)');
      } else {
        throw err;
      }
    }

    // Create new compound unique index
    try {
      await collection.createIndex(
        { youtubeId: 1, uploadedBy: 1 },
        { unique: true, name: 'youtubeId_1_uploadedBy_1' }
      );
      console.log('✅ Created compound unique index (youtubeId + uploadedBy)');
    } catch (err) {
      if (err.code === 85) {
        console.log('ℹ️  Compound index already exists');
      } else {
        throw err;
      }
    }

    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(idx => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log('\n✅ Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();




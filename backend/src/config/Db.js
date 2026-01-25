/**
 * Db.js - Database Connection Configuration
 *
 * This file handles the handshake between your Node.js server and the MongoDB database.
 * We use Mongoose, which is an ODM (Object Data Modeling) library for MongoDB and Node.js.
 * Think of Mongoose as a "Translator" that lets us talk to MongoDB using JavaScript objects.
 */

const mongoose = require("mongoose");
const envVar = require("./EnvVariable");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envVar.MONGODB_URI, { autoIndex: true });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // ✅ Sync indexes ONE-TIME when you want (set env var on Railway)
    // if (process.env.SYNC_INDEXES === "true") {
      console.log("SYNC_INDEXES=true -> syncing MongoDB indexes...");

      const User = require("../models/user.model");
      const Thread = require("../models/thread.model");

      await User.syncIndexes();
      await Thread.syncIndexes();

      console.log("✓ MongoDB indexes synced");
    // }

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

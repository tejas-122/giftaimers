const mongoose = require("mongoose");

let pendingConnection;

// Reuse connections across warm function invocations and concurrent requests.
async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!pendingConnection) {
    pendingConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 5,
    }).finally(() => { pendingConnection = undefined; });
  }
  return pendingConnection;
}

module.exports = connectDB;

const ENV = require("./env");
const mongoose = require("mongoose");

async function connectToDB() {
  try {
    if (!ENV.DB_URI) {
      throw new Error("'DB_URI' is not defined in environment variables!");
    }

    const mongooseInstance = await mongoose.connect(ENV.DB_URI);
    console.log("Connected to MongoDB:", mongooseInstance.connection.host);

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected!");
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    return mongooseInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

module.exports = { connectToDB };

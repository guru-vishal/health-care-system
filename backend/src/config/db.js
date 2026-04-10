const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  const uri = mongoUri || "mongodb+srv://vishal3012006_db_user:cCDMGUSBV7OvS67u@cluster0.yh50twq.mongodb.net/?appName=Cluster0";

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}

module.exports = { connectDb };

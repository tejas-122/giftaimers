require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`GiftAimers API running on port ${PORT}`)))
  .catch(() => {
    console.error("Could not connect to MongoDB; server not started.");
    process.exitCode = 1;
  });

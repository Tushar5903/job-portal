import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

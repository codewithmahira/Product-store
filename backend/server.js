import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from './config/db.js';
import productRoutes from "./routes/product.route.js";
import cors from 'cors';





dotenv.config(); // Load environment variables from .env file


const app = express();
app.use(cors());
const PORT=process.env.PORT || 5000;

const __dirname=path.resolve();

app.use(express.json());  // allow us to json data in req body
app.use("/api/products",productRoutes);


// Log the value of MONGO_URI environment variable (if set in .env)
console.log("Mongo URI:", process.env.MONGO_URI);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:"+PORT);
});

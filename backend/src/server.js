import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SIM-RAMPA API berjalan.", version: "1.0.0" });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SIM-RAMPA API berjalan di http://localhost:${PORT}`);
});

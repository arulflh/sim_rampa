import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { login, profile } from "../controllers/authController.js";
import { getDashboard } from "../controllers/dashboardController.js";
import * as relawan from "../controllers/relawanController.js";
import * as mitra from "../controllers/mitraController.js";
import * as penyaluran from "../controllers/penyaluranController.js";

const router = Router();

// Auth
router.post("/auth/login", login);
router.get("/auth/profile", authMiddleware, profile);

// Dashboard
router.get("/dashboard", authMiddleware, getDashboard);

// Relawan
router.get("/relawan", authMiddleware, relawan.getAll);
router.get("/relawan/:id", authMiddleware, relawan.getOne);
router.post("/relawan", authMiddleware, relawan.create);
router.put("/relawan/:id", authMiddleware, relawan.update);
router.delete("/relawan/:id", authMiddleware, relawan.remove);

// Mitra
router.get("/mitra", authMiddleware, mitra.getAll);
router.get("/mitra/:id", authMiddleware, mitra.getOne);
router.post("/mitra", authMiddleware, mitra.create);
router.put("/mitra/:id", authMiddleware, mitra.update);
router.delete("/mitra/:id", authMiddleware, mitra.remove);

// Penyaluran air
router.get("/penyaluran", authMiddleware, penyaluran.getAll);
router.get("/penyaluran/laporan", authMiddleware, penyaluran.laporan);
router.get("/penyaluran/:id", authMiddleware, penyaluran.getOne);
router.post("/penyaluran", authMiddleware, penyaluran.create);
router.put("/penyaluran/:id", authMiddleware, penyaluran.update);
router.delete("/penyaluran/:id", authMiddleware, penyaluran.remove);

export default router;

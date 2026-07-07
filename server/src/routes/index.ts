import { Router } from "express";
import authRoutes from "./authRoutes";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SourceMind AI API root",
  });
});

router.use("/auth", authRoutes);

export default router;

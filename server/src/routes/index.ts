import { Router } from "express";
import authRoutes from "./authRoutes";
import documentRoutes from "./documentRoutes";
import workspaceRoutes from "./workspaceRoutes";
import chatRoutes from "./chatRoutes";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SourceMind AI API root",
  });
});

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/documents", documentRoutes);
router.use("/chat", chatRoutes);

export default router;

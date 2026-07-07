import { Router } from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
} from "../controllers/workspaceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createWorkspace);
router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

export default router;

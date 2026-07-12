import { Router } from "express";
import {
  getWorkspaceDocuments,
  uploadDocument,
} from "../controllers/documentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { deleteDocument } from "../controllers/deleteDocumentController";

const router = Router();

router.use(authMiddleware);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/workspace/:workspaceId", getWorkspaceDocuments);
router.delete("/:documentId", authMiddleware, deleteDocument);
export default router;

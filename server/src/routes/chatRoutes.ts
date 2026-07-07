import { Router } from "express";
import {
  askQuestion,
  getConversationMessages,
  getWorkspaceConversations,
} from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/ask", askQuestion);
router.get("/conversations/:workspaceId", getWorkspaceConversations);
router.get("/messages/:conversationId", getConversationMessages);

export default router;

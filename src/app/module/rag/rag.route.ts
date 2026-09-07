import { Router } from "express";
import { RagController } from "./rag.controller";

const router = Router();

router.get("/stats",RagController.getStats)

router.post("/ingest-doctor",RagController.ingestDoctor)

export const RagRoutes=router;
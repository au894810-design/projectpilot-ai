import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectpilotRouter from "./projectpilot";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectpilotRouter);

export default router;

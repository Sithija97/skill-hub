import { Router } from "express";
import authRouter from "./modules/auth/auth.router.js";
import customersRouter from "./modules/customers/customers.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/customers", customersRouter);

export default router;

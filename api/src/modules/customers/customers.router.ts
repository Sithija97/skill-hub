import { Router } from "express";
import { authenticateJwt, requireRole } from "../auth/auth.middleware.js";
import { UserRole } from "@prisma/client";
import * as customersController from "./customers.controller.js";

const customersRouter = Router();

customersRouter.use(authenticateJwt);

customersRouter.get("/", customersController.getCustomers);
customersRouter.get("/:id", customersController.getCustomerById);

customersRouter.post(
  "/",
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  customersController.createCustomer,
);

customersRouter.patch(
  "/:id",
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  customersController.updateCustomer,
);

customersRouter.delete(
  "/:id",
  requireRole(UserRole.ADMIN),
  customersController.deleteCustomer,
);

export default customersRouter;

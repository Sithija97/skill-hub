import { Request, Response, NextFunction } from "express";
import { CustomerService } from "../services/customer";
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParamSchema,
} from "../validations/customer";
import { createError } from "../utils/error";

type CustomerParams = { id: string };
type CustomerBody = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  country?: string;
  customer_type?: string;
};

const getValidationMessage = (issues: { message: string }[]) =>
  issues.map((issue) => issue.message).join(", ");

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customers = await CustomerService.getAll();
    res.status(200).json(customers);
  } catch (error) {
    return next(error);
  }
};

export const createCustomer = async (
  req: Request<Record<string, never>, unknown, CustomerBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedBody = createCustomerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(
        createError(400, getValidationMessage(parsedBody.error.issues)),
      );
    }

    const customer = await CustomerService.create(parsedBody.data);
    res.status(201).json(customer);
  } catch (error) {
    return next(error);
  }
};

export const getCustomer = async (
  req: Request<CustomerParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedParams = customerIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return next(
        createError(400, getValidationMessage(parsedParams.error.issues)),
      );
    }

    const customer = await CustomerService.get(parsedParams.data.id);
    res.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
};

export const updateCustomer = async (
  req: Request<CustomerParams, unknown, CustomerBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedParams = customerIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return next(
        createError(400, getValidationMessage(parsedParams.error.issues)),
      );
    }

    const parsedBody = updateCustomerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(
        createError(400, getValidationMessage(parsedBody.error.issues)),
      );
    }

    const customer = await CustomerService.update(
      parsedParams.data.id,
      parsedBody.data,
    );
    res.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
};

export const deleteCustomer = async (
  req: Request<CustomerParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedParams = customerIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return next(
        createError(400, getValidationMessage(parsedParams.error.issues)),
      );
    }

    await CustomerService.delete(parsedParams.data.id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

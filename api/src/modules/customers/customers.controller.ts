import type { Request, Response, NextFunction } from "express";
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
} from "../../schemas/customer.schema.js";
import * as customersService from "./customers.service.js";

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = customerQuerySchema.parse(req.query);
    const result = await customersService.getCustomers(query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customer = await customersService.getCustomerById(
      req.params["id"] as string,
    );
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = createCustomerSchema.parse(req.body);
    const customer = await customersService.createCustomer(body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = updateCustomerSchema.parse(req.body);
    const customer = await customersService.updateCustomer(
      req.params["id"] as string,
      body,
    );
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await customersService.deleteCustomer(req.params["id"] as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

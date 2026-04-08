import { query } from "../db/dbConnection";
import {
  createCustomerTypeQuery,
  createCustomerTableQuery,
  getAllCustomersQuery,
  createCustomerQuery,
  getCustomerQuery,
  updateCustomerQuery,
  deleteCustomerQuery,
} from "../db/customerQuery";
import { createError } from "../utils/error";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../validations/customer";

const ensureCustomerSchema = async () => {
  const response = await query("SELECT to_regclass('customer_details')");
  if (!response.rows[0]?.to_regclass) {
    await query(createCustomerTypeQuery);
    await query(createCustomerTableQuery);
  }
};

export const getAllCustomersService = async () => {
  await ensureCustomerSchema();
  const { rows } = await query(getAllCustomersQuery);
  return rows;
};

export const createCustomerService = async (customer: CreateCustomerInput) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    country,
    customer_type,
  } = customer;

  const data = await query(createCustomerQuery, [
    first_name,
    last_name,
    email,
    phone_number,
    address,
    country,
    customer_type,
  ]);
  return data.rows[0];
};

export const getCustomerService = async (id: string) => {
  const { rows } = await query(getCustomerQuery, [id]);
  if (rows.length === 0) {
    throw createError(404, "Customer not found");
  }

  return rows[0];
};

export const updateCustomerService = async (
  id: string,
  customer: UpdateCustomerInput,
) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    country,
    customer_type,
  } = customer;

  const { rows } = await query(updateCustomerQuery, [
    first_name,
    last_name,
    email,
    phone_number,
    address,
    country,
    customer_type,
    id,
  ]);

  if (rows.length === 0) {
    throw createError(404, "Customer not found");
  }

  return rows[0];
};

export const deleteCustomerService = async (id: string) => {
  const { rows } = await query(deleteCustomerQuery, [id]);

  if (rows.length === 0) {
    throw createError(404, "Customer not found");
  }
};

export const CustomerService = {
  getAll: getAllCustomersService,
  create: createCustomerService,
  get: getCustomerService,
  update: updateCustomerService,
  delete: deleteCustomerService,
};

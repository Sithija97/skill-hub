import type {
  CustomerFilter,
  CustomerSort,
} from "../schemas/customer.schema.js";

export interface FindManyOptions {
  filter?: CustomerFilter;
  sort?: CustomerSort;
  order?: "ASC" | "DESC";
  page: number;
  limit: number;
  search?: string;
}

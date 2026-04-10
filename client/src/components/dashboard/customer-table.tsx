import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerRecord } from "@/types/customer";

interface CustomerTableProps {
  customers: CustomerRecord[];
  onAdd: () => void;
  onDelete: (customer: CustomerRecord) => void;
  onEdit: (customer: CustomerRecord) => void;
  pageSize?: number;
  scrollable?: boolean;
}

type SortKey = keyof Pick<
  CustomerRecord,
  | "firstName"
  | "lastName"
  | "email"
  | "country"
  | "customerType"
  | "dateCreated"
>;
type SortDirection = "asc" | "desc";

const typeVariants: Record<
  CustomerRecord["customerType"],
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "purple"
  | "rose"
  | "orange"
> = {
  Individual: "rose",
  Business: "info",
  Enterprise: "success",
  Partner: "purple",
  Reseller: "orange",
  Other: "outline",
};

export function CustomerTable({
  customers,
  onAdd,
  onDelete,
  onEdit,
  pageSize = 14,
  scrollable = true,
}: CustomerTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const deferredQuery = useDeferredValue(query);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const visible =
      normalizedQuery.length === 0
        ? customers
        : customers.filter((customer) => {
            const haystack = [
              customer.firstName,
              customer.lastName,
              customer.email,
              customer.phoneNumber,
              customer.address,
              customer.country,
              customer.customerType,
            ]
              .join(" ")
              .toLowerCase();

            return haystack.includes(normalizedQuery);
          });

    const sorted = [...visible].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];

      if (sortKey === "dateCreated") {
        const leftDate = new Date(leftValue).getTime();
        const rightDate = new Date(rightValue).getTime();
        return sortDirection === "asc"
          ? leftDate - rightDate
          : rightDate - leftDate;
      }

      const leftText = String(leftValue).toLowerCase();
      const rightText = String(rightValue).toLowerCase();

      if (leftText < rightText) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (leftText > rightText) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [customers, deferredQuery, sortDirection, sortKey]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const toggleSort = (nextSortKey: SortKey) => {
    setPage(1);
    setSortDirection((currentDirection) => {
      if (sortKey !== nextSortKey) {
        setSortKey(nextSortKey);
        return nextSortKey === "dateCreated" ? "desc" : "asc";
      }
      return currentDirection === "asc" ? "desc" : "asc";
    });
    if (sortKey !== nextSortKey) {
      setSortKey(nextSortKey);
    }
  };

  const renderSortIcon = (column: SortKey) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <Card
      className={`flex flex-col border-border bg-card${
        scrollable ? " h-[calc(100vh-9rem)] min-h-[620px]" : ""
      }`}
    >
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-xl">Customer accounts</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and review all customer profiles.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[280px] max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search customers"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button variant={"outline"} size="sm" onClick={onAdd}>
            Add new account
          </Button>
        </div>
      </CardHeader>
      <CardContent
        className={`flex flex-col gap-3${scrollable ? " min-h-0 flex-1" : ""}`}
      >
        <div
          className={`rounded-md border border-border/50${scrollable ? " min-h-0 flex-1 overflow-auto" : ""}`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("firstName")}
                    type="button"
                  >
                    First name
                    {renderSortIcon("firstName")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("lastName")}
                    type="button"
                  >
                    Last name
                    {renderSortIcon("lastName")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("email")}
                    type="button"
                  >
                    Email
                    {renderSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2">Phone</TableHead>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("country")}
                    type="button"
                  >
                    Country
                    {renderSortIcon("country")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("customerType")}
                    type="button"
                  >
                    Type
                    {renderSortIcon("customerType")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2">
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort("dateCreated")}
                    type="button"
                  >
                    Date created
                    {renderSortIcon("dateCreated")}
                  </button>
                </TableHead>
                <TableHead className="h-10 py-2 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="py-2 font-medium">
                    {customer.firstName}
                  </TableCell>
                  <TableCell className="py-2">{customer.lastName}</TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {customer.email}
                  </TableCell>
                  <TableCell className="py-2">{customer.phoneNumber}</TableCell>
                  <TableCell className="py-2">{customer.country}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant={typeVariants[customer.customerType]}>
                      {customer.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {new Date(customer.dateCreated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(customer)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedCustomers.length} of {filteredCustomers.length}{" "}
            customers
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@base-ui/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  return (
    <main className="flex  flex-col items-center justify-center p-24">
      <Badge variant="secondary" className="mb-4">
        Home
      </Badge>
      <br />
      <Button onClick={() => redirect("/dashboard")}>Get Started</Button>
    </main>
  );
}

import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { TableManager } from "@/modules/admin/components/TableManager";

export default async function TablesPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <TableManager />;
}

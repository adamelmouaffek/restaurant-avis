import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { StaffManager } from "@/modules/admin/components/StaffManager";

export default async function StaffPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <StaffManager />;
}

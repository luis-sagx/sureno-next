export const dynamic = "force-dynamic";

import { getUsers } from "@/lib/actions/admin";
import { serializeDecimal } from "@/lib/serialize";
import { StatsCard } from "@/components/ui/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { Users, Building2, TrendingUp, UserCheck } from "lucide-react";
import { UserDirectoryClient } from "./UserDirectoryClient";

interface UsersPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const type = params.type || "Todos";
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";

  const [allData, individualData, wholesaleData, usersData] = serializeDecimal(
    await Promise.all([
      getUsers({ page: 1, limit: 1, type: undefined }),
      getUsers({ page: 1, limit: 1, type: "INDIVIDUAL" }),
      getUsers({ page: 1, limit: 1, type: "WHOLESALE" }),
      getUsers({
        page,
        limit: 15,
        type: type !== "Todos" ? type : undefined,
        search: search || undefined,
      }),
    ])
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-headline text-3xl text-on-surface">
          Directorio de Usuarios
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Consulta la información de tus clientes y su actividad
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          value={allData.total.toLocaleString("es-MX")}
          label="Total Clientes"
          trend={{ value: "↑12%", positive: true }}
        />
        <StatsCard
          icon={Building2}
          value={wholesaleData.total}
          label="Cuentas Mayoristas"
        />
        <StatsCard
          icon={TrendingUp}
          value="$412.50"
          label="Ticket Promedio"
        />
        <StatsCard
          icon={UserCheck}
          value="892"
          label="Activos Esta Semana"
        />
      </div>

      {/* Pass data to client component for interactive tabs and drawer */}
      <UserDirectoryClient
        initialUsers={usersData.users}
        total={usersData.total}
        page={usersData.page}
        totalPages={usersData.totalPages}
        currentType={type}
        currentSearch={search}
      />
    </div>
  );
}

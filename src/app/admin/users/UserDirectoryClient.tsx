"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import { cn } from "@/lib/utils";
import { Search, Users, Filter, User } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  type: string;
  company: string | null;
  taxId: string | null;
  address: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  orderCount: number;
}

interface UserDirectoryClientProps {
  initialUsers: UserRow[];
  total: number;
  page: number;
  totalPages: number;
  currentType: string;
  currentSearch: string;
}

const tabs = [
  { key: "Todos", label: "Todos" },
  { key: "INDIVIDUAL", label: "Individual" },
  { key: "WHOLESALE", label: "Mayorista" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserDirectoryClient({
  initialUsers,
  total,
  page,
  totalPages,
  currentType,
  currentSearch,
}: UserDirectoryClientProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);

  function handleTabChange(typeKey: string) {
    const params = new URLSearchParams();
    if (typeKey !== "Todos") params.set("type", typeKey);
    if (currentSearch) params.set("search", currentSearch);
    router.push(`/admin/users?${params.toString()}`);
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (currentType !== "Todos") params.set("type", currentType);
    if (searchInput) params.set("search", searchInput);
    router.push(`/admin/users?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams();
    if (currentType !== "Todos") params.set("type", currentType);
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", String(newPage));
    router.push(`/admin/users?${params.toString()}`);
  }

  const columns = [
    {
      key: "name",
      header: "Nombre",
      render: (user: UserRow) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-secondary">
              {getInitials(user.name)}
            </span>
          </div>
          <div>
            <p className="text-sm text-on-surface font-medium">{user.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Empresa",
      render: (user: UserRow) => (
        <span className="text-sm text-on-surface-variant">
          {user.company || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (user: UserRow) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase",
            user.type === "INDIVIDUAL"
              ? "bg-secondary/20 text-secondary"
              : "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
          )}
        >
          {user.type === "INDIVIDUAL" ? "Individual" : "Mayorista"}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: UserRow) => (
        <span className="text-sm text-on-surface-variant">{user.email}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Fecha Registro",
      render: (user: UserRow) => (
        <span className="text-sm text-on-surface-variant tabular-nums">
          {new Date(user.createdAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "orderCount",
      header: "Total Órdenes",
      render: (user: UserRow) => (
        <span className="text-sm text-on-surface font-medium tabular-nums">
          {user.orderCount}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (user: UserRow) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedUserId(user.id)}
        >
          <User className="w-4 h-4 mr-1" />
          Ver
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              currentType === tab.key
                ? "bg-background text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Buscar por nombre, email o empresa..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleSearch}>
          <Filter className="w-4 h-4 mr-2" />
          Buscar
        </Button>
        {currentSearch && (
          <button
            onClick={() => {
              setSearchInput("");
              const params = new URLSearchParams();
              if (currentType !== "Todos") params.set("type", currentType);
              router.push(`/admin/users?${params.toString()}`);
            }}
            className="text-sm text-secondary hover:text-secondary/80"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Table */}
      {initialUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin usuarios"
          description="No se encontraron usuarios con los filtros actuales."
        />
      ) : (
        <DataTable
          columns={columns as any}
          data={initialUsers as any}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* User Detail Drawer */}
      {selectedUserId && (
        <UserDetailDrawer
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}

import { Navigate, Outlet } from "react-router";
import { useGetIdentity } from "@refinedev/core";
import { User, UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface RequireRoleProps {
  roles: UserRole[];
}

export const RequireRole = ({ roles }: RequireRoleProps) => {
  const { data: user, isLoading } = useGetIdentity<User>();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

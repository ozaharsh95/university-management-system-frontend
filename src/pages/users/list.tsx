import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Search, Edit, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { useUpdate, useNotification, useGetIdentity } from "@refinedev/core";
import { User, UserRole } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

const UsersList = () => {
  const { data: currentUser } = useGetIdentity<User>();
  const isTeacher = currentUser?.role === UserRole.TEACHER;

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: UserRole.STUDENT });

  const { open } = useNotification();
  const { mutate: updateMutate, mutation: updateMutation } = useUpdate();
  const isUpdating = updateMutation.isPending;

  const activeFilters = useMemo(() => {
    const filters = [];
    if (isTeacher) {
      filters.push({
        field: "role",
        operator: "eq" as const,
        value: "student",
      });
    } else if (roleFilter !== "all") {
      filters.push({
        field: "role",
        operator: "eq" as const,
        value: roleFilter,
      });
    }
    if (searchQuery) {
      filters.push({
        field: "search",
        operator: "contains" as const,
        value: searchQuery,
      });
    }
    return filters;
  }, [roleFilter, searchQuery, isTeacher]);

  const userTable = useTable<User>({
    columns: useMemo<ColumnDef<User>[]>(
      () => [
        {
          id: "avatar",
          size: 70,
          header: () => <p className="column-title ml-2">Avatar</p>,
          cell: ({ row }: any) => {
            const name = row.original.name || "User";
            const initials = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part: string) => part[0]?.toUpperCase())
              .join("");
            return (
              <Avatar className="h-9 w-9 ml-2 border border-border">
                <AvatarImage src={row.original.image} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Name</p>,
          cell: ({ getValue }: any) => (
            <span className="font-medium text-foreground">{(getValue() as string)}</span>
          ),
        },
        {
          id: "email",
          accessorKey: "email",
          size: 220,
          header: () => <p className="column-title">Email Address</p>,
          cell: ({ getValue }: any) => (
            <span className="text-muted-foreground">{(getValue() as string)}</span>
          ),
        },
        {
          id: "role",
          accessorKey: "role",
          size: 130,
          header: () => <p className="column-title">Role</p>,
          cell: ({ getValue }: any) => {
            const role = getValue() as UserRole;
            let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
            if (role === UserRole.ADMIN) {
              variant = "destructive";
            } else if (role === UserRole.TEACHER) {
              variant = "default";
            }
            return (
              <Badge variant={variant} className="capitalize">
                {role}
              </Badge>
            );
          },
        },
        {
          id: "createdAt",
          accessorKey: "createdAt",
          size: 150,
          header: () => <p className="column-title">Joined On</p>,
          cell: ({ getValue }: any) => {
            const dateStr = getValue() as string;
            if (!dateStr) return "-";
            const formatted = new Date(dateStr).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return <span className="text-muted-foreground text-xs">{formatted}</span>;
          },
        },
        {
          id: "actions",
          size: 100,
          header: () => <p className="column-title text-center">Actions</p>,
          cell: ({ row }: any) => (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingUser(row.original);
                  setFormData({
                    name: row.original.name,
                    email: row.original.email,
                    role: row.original.role,
                  });
                }}
              >
                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">Edit User</span>
              </Button>
            </div>
          ),
        },
      ].filter((col) => {
        if (isTeacher && col.id === "actions") return false;
        return true;
      }),
      [isTeacher],
    ),
    refineCoreProps: {
      resource: "users",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: activeFilters,
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateMutate(
      {
        resource: "users",
        id: editingUser.id,
        values: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        },
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "User updated successfully",
            description: `Successfully updated credentials for ${formData.name}`,
          });
          setEditingUser(null);
          userTable.reactTable.reset();
        },
        onError: (error) => {
          open?.({
            type: "error",
            message: "Failed to update user",
            description: error.message || "An error occurred during update.",
          });
        },
      },
    );
  };

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title flex items-center gap-2">
        <span>{isTeacher ? "Students Directory" : "Users Management"}</span>
        {!isTeacher && <Badge variant="outline" className="font-mono text-[10px]">ADMIN PANEL</Badge>}
      </h1>

      <div className="intro-row">
        <p>{isTeacher ? "View and search the directory of all registered students in the system." : "View registered student and teacher profiles, search users, and manage account roles."}</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email ..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!isTeacher && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                  <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <DataTable table={userTable} />

      {/* Edit User Modal Dialog */}
      <Dialog open={editingUser !== null} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Modify name, email, or role. Admin actions are logged.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveChanges} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">System Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, role: val as UserRole }))}
              >
                <SelectTrigger id="role" className="w-full capitalize">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN} className="capitalize">
                    <span className="flex items-center gap-1.5 text-destructive font-semibold">
                      <ShieldAlert className="h-3.5 w-3.5" /> admin
                    </span>
                  </SelectItem>
                  <SelectItem value={UserRole.TEACHER} className="capitalize">teacher</SelectItem>
                  <SelectItem value={UserRole.STUDENT} className="capitalize">student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ListView>
  );
};

export default UsersList;

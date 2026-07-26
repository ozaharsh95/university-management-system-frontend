import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { Department } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreate, useUpdate, useDelete } from "@refinedev/core";

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createMutate, mutation: createMutation } = useCreate();
  const isCreating = createMutation.isPending;
  const { mutate: updateMutate, mutation: updateMutation } = useUpdate();
  const isUpdating = updateMutation.isPending;
  const { mutate: deleteMutate } = useDelete();

  const searchFilters = searchQuery
    ? [{ field: "search", operator: "contains" as const, value: searchQuery }]
    : [];

  const deptTable = useTable<Department>({
    columns: useMemo<ColumnDef<Department>[]>(
      () => [
        {
          id: "code",
          accessorKey: "code",
          size: 120,
          header: () => <p className="column-title ml-2 font-bold">Code</p>,
          cell: ({ getValue }) => <Badge variant="outline" className="font-semibold">{getValue<string>()}</Badge>,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 250,
          header: () => <p className="column-title ml-2 font-bold">Name</p>,
          cell: ({ getValue }) => (
            <span className="font-medium text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 350,
          header: () => <p className="column-title ml-2 font-bold">Description</p>,
          cell: ({ getValue }) => (
            <span className="truncate block max-w-xs text-muted-foreground">{getValue<string>() || "N/A"}</span>
          ),
        },
        {
          id: "actions",
          header: () => <p className="column-title ml-2 font-bold">Actions</p>,
          size: 150,
          cell: ({ row }) => {
            const dept = row.original;
            return (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => handleOpenEdit(dept)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(dept.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          },
        },
      ],
      []
    ),
    refineCoreProps: {
      resource: "departments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const handleOpenCreate = () => {
    setName("");
    setCode("");
    setDescription("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setCurrentDept(dept);
    setName(dept.name);
    setCode(dept.code || "");
    setDescription(dept.description || "");
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    createMutate(
      {
        resource: "departments",
        values: { name, code, description },
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          deptTable.refineCore.tableQuery.refetch();
        },
      }
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !currentDept) return;

    updateMutate(
      {
        resource: "departments",
        id: currentDept.id,
        values: { name, code, description },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          deptTable.refineCore.tableQuery.refetch();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this department? This cannot be undone.")) {
      deleteMutate(
        {
          resource: "departments",
          id: id,
        },
        {
          onSuccess: () => {
            deptTable.refineCore.tableQuery.refetch();
          },
        }
      );
    }
  };

  return (
    <ListView>
      <Breadcrumb />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title font-bold">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic faculties, department details, and codes.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex gap-2">
          <Plus className="h-4 w-4" /> Create Department
        </Button>
      </div>

      <div className="intro-row mt-6">
        <div className="actions-row">
          <div className="search-field max-w-sm">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search departments..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable table={deptTable} />
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Add a new academic department to the university structure.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CS"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Computer Science"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Desc
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Department details..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the name, code, or description of this department.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Code
                </Label>
                <Input
                  id="edit-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CS"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Computer Science"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Desc
                </Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Department details..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ListView>
  );
};

export default DepartmentsList;

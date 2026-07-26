import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Plus, Trash2, UserPlus, GraduationCap, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate, useDelete, useList } from "@refinedev/core";
import { User } from "@/types";

type EnrollmentRecord = {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  class: {
    id: number;
    name: string;
    inviteCode: string;
  };
};

const EnrollmentsList = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const { mutate: createMutate, mutation: createMutation } = useCreate();
  const isSubmitting = createMutation.isPending;
  const { mutate: deleteMutate } = useDelete();

  // Load students list for the dropdown
  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "student",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  // Load classes list for the dropdown
  const { query: classesQuery } = useList<any>({
    resource: "classes",
    pagination: {
      pageSize: 100,
    },
  });

  const studentsList = studentsQuery?.data?.data || [];
  const isStudentsLoading = studentsQuery?.isLoading;
  const classesList = classesQuery?.data?.data || [];
  const isClassesLoading = classesQuery?.isLoading;

  const enrollmentTable = useTable<EnrollmentRecord>({
    columns: useMemo<ColumnDef<EnrollmentRecord>[]>(
      () => [
        {
          id: "student",
          accessorKey: "student",
          size: 250,
          header: () => <p className="column-title ml-2 font-bold">Student</p>,
          cell: ({ getValue }) => {
            const student = getValue<EnrollmentRecord["student"]>();
            if (!student) return <span className="text-muted-foreground">N/A</span>;
            const initials = student.name
              ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase()
              : "?";
            return (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={student.image} alt={student.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{student.name}</span>
                  <span className="text-xs text-muted-foreground">{student.email}</span>
                </div>
              </div>
            );
          },
        },
        {
          id: "class",
          accessorKey: "class.name",
          size: 200,
          header: () => <p className="column-title ml-2 font-bold">Class</p>,
          cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{getValue<string>()}</span>
            </div>
          ),
        },
        {
          id: "inviteCode",
          accessorKey: "class.inviteCode",
          size: 150,
          header: () => <p className="column-title ml-2 font-bold">Invite Code</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider">
              {getValue<string>()}
            </Badge>
          ),
        },
        {
          id: "createdAt",
          accessorKey: "createdAt",
          size: 180,
          header: () => <p className="column-title ml-2 font-bold">Enrolled On</p>,
          cell: ({ getValue }) => {
            const val = getValue<string>();
            const dateStr = val ? new Date(val).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) : "N/A";
            return (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>{dateStr}</span>
              </div>
            );
          },
        },
        {
          id: "actions",
          header: () => <p className="column-title ml-2 font-bold">Actions</p>,
          size: 120,
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleUnenroll(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ),
        },
      ],
      []
    ),
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  const handleOpenCreate = () => {
    setSelectedStudent("");
    setSelectedClass("");
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) return;

    createMutate(
      {
        resource: "enrollments",
        values: {
          studentId: selectedStudent,
          classId: parseInt(selectedClass, 10),
        },
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          enrollmentTable.refineCore.tableQuery.refetch();
        },
      }
    );
  };

  const handleUnenroll = (id: number) => {
    if (confirm("Are you sure you want to unenroll this student from the class?")) {
      deleteMutate(
        {
          resource: "enrollments",
          id: id,
        },
        {
          onSuccess: () => {
            enrollmentTable.refineCore.tableQuery.refetch();
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
          <h1 className="page-title font-bold">Enrollments</h1>
          <p className="text-muted-foreground text-sm">
            Monitor and manage student assignments to classrooms.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex gap-2">
          <UserPlus className="h-4 w-4" /> Enroll Student
        </Button>
      </div>

      <div className="mt-6">
        <DataTable table={enrollmentTable} />
      </div>

      {/* ENROLL DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Enroll Student</DialogTitle>
              <DialogDescription>
                Assign a student user to an active classroom course.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="student" className="font-semibold">
                  Select Student
                </Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student" className="w-full">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {isStudentsLoading ? (
                      <SelectItem value="loading" disabled>Loading students...</SelectItem>
                    ) : (
                      studentsList.map((student: User) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="class" className="font-semibold">
                  Select Class
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class" className="w-full">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {isClassesLoading ? (
                      <SelectItem value="loading" disabled>Loading classes...</SelectItem>
                    ) : (
                      classesList.map((cls: any) => (
                        <SelectItem key={cls.id} value={String(cls.id)}>
                          {cls.name} (Code: {cls.inviteCode})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedStudent || !selectedClass}>
                {isSubmitting ? "Enrolling..." : "Enroll"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ListView>
  );
};

export default EnrollmentsList;

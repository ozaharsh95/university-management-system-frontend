import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ClassDetails, Subject, User, UserRole } from "@/types";
import { useList, useGetIdentity } from "@refinedev/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShowButton } from "@/components/refine-ui/buttons/show";

const ClassesList = () => {
  const { data: currentUser, isLoading: isIdentityLoading } =
    useGetIdentity<User>();
  const isTeacher = currentUser?.role === UserRole.TEACHER;
  const isStudent = currentUser?.role === UserRole.STUDENT;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const { query: subjectQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
    queryOptions: {
      enabled: !!currentUser && !isStudent,
    },
  });

  const subjectsData = subjectQuery?.data?.data || [];
  const subjectsLoading = subjectQuery?.isLoading;

  const teachersData = teachersQuery?.data?.data || [];
  const teachersLoading = teachersQuery?.isLoading;

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const roleFilters = useMemo(() => {
    if (!currentUser) return [];
    const filters = [];
    if (isTeacher && currentUser?.id) {
      filters.push({
        field: "teacherId",
        operator: "eq" as const,
        value: currentUser.id,
      });
    }
    if (isStudent && currentUser?.id) {
      filters.push({
        field: "studentId",
        operator: "eq" as const,
        value: currentUser.id,
      });
    }
    return filters;
  }, [isTeacher, isStudent, currentUser]);

  const classesTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 100,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => <img src={getValue<string>()} />,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title ml-2">Class name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "status",
          accessorKey: "status",
          size: 150,
          header: () => <p className="column-title ml-2">status</p>,
          cell: ({ getValue }) => (
            <Badge variant={"default"}>
              {getValue<string>()?.toUpperCase()}
            </Badge>
          ),
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 200,
          header: () => <p className="column-title ml-2">Subject</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
        {
          id: "teacher",
          accessorKey: "teacher.name",
          size: 200,
          header: () => <p className="column-title ml-2">Teacher</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 100,
          header: () => <p className="column-title ml-2">Capacity</p>,
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
        {
          id: "details",

          size: 150,
          header: () => <p className="column-title ml-2">Details</p>,
          cell: ({ row }) => (
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant={"outline"}
              size={"sm"}
            >
              View
            </ShowButton>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          ...subjectFilters,
          ...teacherFilters,
          ...searchFilters,
          ...roleFilters,
        ],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
      queryOptions: {
        enabled: !!currentUser,
      },
    },
  });

  if (isIdentityLoading || !currentUser) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">
        {isTeacher || isStudent ? "My Classes" : "Classes"}
      </h1>

      <div className="intro-row">
        <p>
          {isTeacher || isStudent
            ? "Quick access to your assigned classrooms, active schedules, and course resources."
            : "Quick access to essential metrics and management tools."}
        </p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by name ..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {!isStudent && (
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={subjectsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjectsData.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {!isTeacher && !isStudent && (
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
                disabled={teachersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by teacher" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachersData.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isTeacher && !isStudent && <CreateButton />}
          </div>
        </div>
      </div>

      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users } from "lucide-react";

interface TeacherClassActivity {
  id: number;
  name: string;
  subjectName: string;
  capacity: number;
  studentsCount: string | number;
  status: string;
}

interface RecentEnrollment {
  id: number;
  studentName: string;
  studentEmail: string;
  studentImage?: string;
  className: string;
  createdAt: string;
}

export interface TeacherActivityData {
  myClasses?: TeacherClassActivity[];
  recentEnrollments?: RecentEnrollment[];
}

interface DashboardActivityProps {
  data?: TeacherActivityData;
  isLoading: boolean;
}

const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

export const DashboardActivity: React.FC<DashboardActivityProps> = ({
  data,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = React.useState("my-classes");

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  const myClasses = data.myClasses || [];
  const recentEnrollments = data.recentEnrollments || [];

  const tabs = [
    { id: "my-classes", label: "My Classes", icon: GraduationCap },
    { id: "recent-enrollments", label: "Recent Enrollments", icon: Users },
  ];

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">
          Classroom & Enrollment Logs
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Real-time logs of your teaching schedules and latest student
          registrations.
        </CardDescription>
      </CardHeader>

      <div className="px-6 bg-transparent">
        <div className="flex gap-6 border-b border-border w-full overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 pt-1 border-b-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer outline-none ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto mt-2">
        {activeTab === "my-classes" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">
                  Class Name
                </TableHead>
                <TableHead className="py-3 font-semibold">Subject</TableHead>
                <TableHead className="py-3 font-semibold">Capacity</TableHead>
                <TableHead className="py-3 font-semibold">
                  Enrolled Students
                </TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myClasses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    No classes found.
                  </TableCell>
                </TableRow>
              ) : (
                myClasses.map((cls) => {
                  const statusColors: Record<string, string> = {
                    active:
                      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                    inactive:
                      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
                    archived:
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                  };
                  const enrolledCount = Number(cls.studentsCount);
                  const fillPercentage =
                    cls.capacity > 0
                      ? Math.round((enrolledCount / cls.capacity) * 100)
                      : 0;

                  return (
                    <TableRow key={cls.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-3.5">
                        <p className="font-semibold text-foreground text-sm max-w-[250px] truncate">
                          {cls.name}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">
                        {cls.subjectName}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-muted-foreground">
                        {cls.capacity} Seats
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {enrolledCount} Students
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({fillPercentage}% full)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 py-3.5 text-right">
                        <Badge
                          variant="outline"
                          className={`${
                            statusColors[cls.status.toLowerCase()] || "bg-muted"
                          } text-[10px] font-bold px-2 py-0.5 rounded-sm capitalize`}
                        >
                          {cls.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {activeTab === "recent-enrollments" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">
                  Student
                </TableHead>
                <TableHead className="py-3 font-semibold">
                  Class Enrolled
                </TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">
                  Enrolled At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    No recent enrollments found.
                  </TableCell>
                </TableRow>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            enrollment.studentImage ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                          }
                          alt={enrollment.studentName}
                          className="h-9 w-9 rounded-full object-cover border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";
                          }}
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm mb-0.5">
                            {enrollment.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {enrollment.studentEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground max-w-[250px] truncate">
                      {enrollment.className}
                    </TableCell>
                    <TableCell className="pr-6 py-3.5 text-right text-xs text-muted-foreground font-medium">
                      {formatDateTime(enrollment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

const ActivitySkeleton: React.FC = () => {
  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <CardHeader className="p-6 pb-2 border-b border-border/40 space-y-2">
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </CardHeader>
      <div className="px-6 pt-4 pb-4">
        <Skeleton className="h-9 w-full max-w-xl rounded-lg" />
      </div>
      <div className="p-6 pt-2">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded" />
          ))}
        </div>
      </div>
    </Card>
  );
};

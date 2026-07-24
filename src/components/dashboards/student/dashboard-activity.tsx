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
import { GraduationCap, Clock, ClipboardList } from "lucide-react";

interface StudentClassActivity {
  classId: number;
  className: string;
  teacherName: string;
  subjectName: string;
  status: string;
}

interface UpcomingClassActivity {
  time: string;
  endTime: string;
  className: string;
  teacherName: string;
  subjectName: string;
}

interface EnrollmentActivity {
  subjectName: string;
  departmentName: string;
  joinedOn: string;
}

export interface StudentActivityData {
  myClasses?: StudentClassActivity[];
  upcomingClasses?: UpcomingClassActivity[];
  myEnrollments?: EnrollmentActivity[];
}

interface DashboardActivityProps {
  data?: StudentActivityData;
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

const formatTime12h = (time24h: string) => {
  try {
    const [hoursStr, minutesStr] = time24h.split(":");
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutesStr} ${ampm}`;
  } catch {
    return time24h;
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
  const upcomingClasses = data.upcomingClasses || [];
  const myEnrollments = data.myEnrollments || [];

  const tabs = [
    { id: "my-classes", label: "My Classes", icon: GraduationCap },
    { id: "upcoming-classes", label: "Today's Classes", icon: Clock },
    { id: "my-enrollments", label: "My Enrollments", icon: ClipboardList },
  ];

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">
          Classroom & Enrollment Activities
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Real-time access to your academic classes, daily schedule, and course
          registration history.
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
                <TableHead className="py-3 font-semibold">Teacher</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myClasses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    You are not enrolled in any classes yet.
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
                  return (
                    <TableRow key={cls.classId} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-3.5">
                        <p className="font-semibold text-foreground text-sm max-w-[250px] truncate">
                          {cls.className}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">
                        {cls.subjectName}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-foreground">
                        {cls.teacherName}
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

        {activeTab === "upcoming-classes" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">
                  Time Slot
                </TableHead>
                <TableHead className="py-3 font-semibold">Class Name</TableHead>
                <TableHead className="py-3 font-semibold">Subject</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">
                  Teacher
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingClasses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    No classes scheduled for today.
                  </TableCell>
                </TableRow>
              ) : (
                upcomingClasses.map((cls, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    <TableCell className="pl-6 py-3.5">
                      <span className="font-semibold text-xs text-primary bg-primary/10 border border-primary/20 rounded px-2.5 py-0.5">
                        {formatTime12h(cls.time)} - {formatTime12h(cls.endTime)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 font-semibold text-foreground text-sm max-w-[250px] truncate">
                      {cls.className}
                    </TableCell>
                    <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">
                      {cls.subjectName}
                    </TableCell>
                    <TableCell className="pr-6 py-3.5 text-right text-xs font-medium text-foreground">
                      {cls.teacherName}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {activeTab === "my-enrollments" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">
                  Subject Name
                </TableHead>
                <TableHead className="py-3 font-semibold">Department</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">
                  Joined On
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground font-medium"
                  >
                    No enrollment history found.
                  </TableCell>
                </TableRow>
              ) : (
                myEnrollments.map((enrollment, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/20">
                    <TableCell className="pl-6 py-3.5">
                      <p className="font-semibold text-foreground text-sm">
                        {enrollment.subjectName}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">
                      {enrollment.departmentName}
                    </TableCell>
                    <TableCell className="pr-6 py-3.5 text-right text-xs text-muted-foreground font-medium">
                      {formatDateTime(enrollment.joinedOn)}
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

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, ClipboardList, TrendingUp } from "lucide-react";

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

interface RecentClass {
  id: number;
  name: string;
  description: string;
  capacity: number;
  status: string;
  inviteCode: string;
  subjectName: string;
  teacherName: string;
  createdAt: string;
}

interface LatestEnrollment {
  id: number;
  studentName: string;
  studentEmail: string;
  className: string;
  classInviteCode: string;
  createdAt: string;
}

interface TopFilledClass {
  id: number;
  name: string;
  inviteCode: string;
  capacity: number;
  subjectName: string;
  enrolledCount: string | number;
}

export interface DashboardActivityData {
  recentUsers?: RecentUser[];
  recentClasses?: RecentClass[];
  latestEnrollments?: LatestEnrollment[];
  topFilledClasses?: TopFilledClass[];
}

interface DashboardActivityProps {
  data?: DashboardActivityData;
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

export const DashboardActivity: React.FC<DashboardActivityProps> = ({ data, isLoading }) => {
  const [activeTab, setActiveTab] = React.useState("recent-users");

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  const recentUsers = data.recentUsers || [];
  const recentClasses = data.recentClasses || [];
  const latestEnrollments = data.latestEnrollments || [];
  const topFilledClasses = data.topFilledClasses || [];

  const tabs = [
    { id: "recent-users", label: "Recent Users", icon: Users },
    { id: "recent-classes", label: "Recent Classes", icon: GraduationCap },
    { id: "latest-enrollments", label: "Enrollments", icon: ClipboardList },
    { id: "top-filled", label: "Class Fill Rate", icon: TrendingUp },
  ];

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">System Activity Logs</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Real-time logs of system registrations, class creations, and course enrollments.
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
        {activeTab === "recent-users" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[300px] pl-6 py-3 font-semibold">User Info</TableHead>
                <TableHead className="py-3 font-semibold">Role</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-medium">
                    No recent users found.
                  </TableCell>
                </TableRow>
              ) : (
                recentUsers.map((user) => {
                  const roleColors: Record<string, string> = {
                    admin: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 uppercase tracking-wide",
                    teacher: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 uppercase tracking-wide",
                    student: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 uppercase tracking-wide",
                  };
                  return (
                    <TableRow key={user.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-none mb-1">{user.name}</p>
                            <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="outline" className={`${roleColors[user.role.toLowerCase()] || "bg-muted text-muted-foreground border-transparent"} text-[10px] font-bold px-2 py-0.5 rounded-sm`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-3.5 text-right text-xs text-muted-foreground font-medium">
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {activeTab === "recent-classes" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">Class Name</TableHead>
                <TableHead className="py-3 font-semibold">Subject</TableHead>
                <TableHead className="py-3 font-semibold">Teacher</TableHead>
                <TableHead className="py-3 font-semibold">Invite Code</TableHead>
                <TableHead className="py-3 font-semibold">Capacity</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-medium">
                    No recent classes found.
                  </TableCell>
                </TableRow>
              ) : (
                recentClasses.map((cls) => {
                  const statusColors: Record<string, string> = {
                    active: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                    inactive: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
                    archived: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                  };
                  return (
                    <TableRow key={cls.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-3.5">
                        <p className="font-semibold text-foreground text-sm max-w-[200px] truncate">{cls.name}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">{cls.subjectName}</TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-foreground">{cls.teacherName}</TableCell>
                      <TableCell className="py-3.5">
                        <span className="font-mono text-xs bg-muted/60 dark:bg-muted/40 px-2 py-0.5 rounded text-muted-foreground font-semibold border border-border/40">
                          {cls.inviteCode}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-muted-foreground">{cls.capacity} Seats</TableCell>
                      <TableCell className="pr-6 py-3.5 text-right">
                        <Badge variant="outline" className={`${statusColors[cls.status.toLowerCase()] || "bg-muted"} text-[10px] font-bold px-2 py-0.5 rounded-sm capitalize`}>
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

        {activeTab === "latest-enrollments" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">Student</TableHead>
                <TableHead className="py-3 font-semibold">Class Enrolled</TableHead>
                <TableHead className="py-3 font-semibold">Invite Code</TableHead>
                <TableHead className="pr-6 py-3 font-semibold text-right">Enrolled At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-medium">
                    No recent enrollments found.
                  </TableCell>
                </TableRow>
              ) : (
                latestEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6 py-3.5">
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-0.5">{enrollment.studentName}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground max-w-[200px] truncate">
                      {enrollment.className}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="font-mono text-xs bg-muted/60 dark:bg-muted/40 px-2 py-0.5 rounded text-muted-foreground font-semibold border border-border/40">
                        {enrollment.classInviteCode}
                      </span>
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

        {activeTab === "top-filled" && (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 py-3 font-semibold">Classroom Name</TableHead>
                <TableHead className="py-3 font-semibold">Subject</TableHead>
                <TableHead className="py-3 font-semibold">Invite Code</TableHead>
                <TableHead className="py-3 font-semibold">Ratio (Students/Capacity)</TableHead>
                <TableHead className="pr-6 py-3 font-semibold w-[250px] text-right">Fill Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topFilledClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">
                    No filled classes data available.
                  </TableCell>
                </TableRow>
              ) : (
                topFilledClasses.map((cls) => {
                  const enrolled = Number(cls.enrolledCount);
                  const fillPercentage = Math.round((enrolled / cls.capacity) * 100);

                  // Dynamic fill bar coloring
                  let progressColor = "bg-primary";
                  if (fillPercentage >= 85) progressColor = "bg-red-500";
                  else if (fillPercentage >= 50) progressColor = "bg-amber-500";

                  return (
                    <TableRow key={cls.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-3.5">
                        <p className="font-semibold text-foreground text-sm max-w-[200px] truncate">{cls.name}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-semibold text-muted-foreground">{cls.subjectName}</TableCell>
                      <TableCell className="py-3.5">
                        <span className="font-mono text-xs bg-muted/60 dark:bg-muted/40 px-2 py-0.5 rounded text-muted-foreground font-semibold border border-border/40">
                          {cls.inviteCode}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-bold text-foreground">
                        {enrolled} / {cls.capacity} ({fillPercentage}%)
                      </TableCell>
                      <TableCell className="pr-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3 w-full">
                          <div className="h-2 w-32 bg-muted/60 dark:bg-muted/40 rounded-full overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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

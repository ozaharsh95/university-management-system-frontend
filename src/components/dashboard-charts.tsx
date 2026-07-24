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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Label,
  Cell,
} from "recharts";

interface DepartmentStudentData {
  departmentId: number;
  departmentName: string;
  totalStudents: string | number;
}

interface DepartmentClassData {
  departmentId: number;
  departmentName: string;
  totalClasses: string | number;
}

interface ClassStatusData {
  status: string;
  count: string | number;
}

interface TeacherLeaderboardData {
  id: string;
  name: string;
  email: string;
  image?: string;
  classCount: string | number;
}

export interface DashboardChartsData {
  studentsPerDepartment?: DepartmentStudentData[];
  classesPerDepartment?: DepartmentClassData[];
  classesStatusWise?: ClassStatusData[];
  topTeachers?: TeacherLeaderboardData[];
}

interface DashboardChartsProps {
  data?: DashboardChartsData;
  isLoading: boolean;
}

// Chart configurations for Shadcn UI Chart components
const studentsChartConfig: ChartConfig = {
  students: {
    label: "Students",
    color: "var(--color-primary)",
  },
};

const classesChartConfig: ChartConfig = {
  classes: {
    label: "Classes",
    color: "var(--color-chart-2)",
  },
};

const statusChartConfig: ChartConfig = {
  active: {
    label: "Active",
    color: "var(--color-chart-1)",
  },
  inactive: {
    label: "Inactive",
    color: "var(--color-muted-foreground)",
  },
  archived: {
    label: "Archived",
    color: "var(--color-chart-3)",
  },
};

const teachersChartConfig: ChartConfig = {
  classesTaught: {
    label: "Classes Taught",
    color: "var(--color-chart-5)",
  },
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return <ChartsSkeletonGrid />;
  }

  // 1. Process Students per Department
  const studentsData = (data.studentsPerDepartment || []).map((item) => ({
    name: item.departmentName,
    students: Number(item.totalStudents),
  }));

  // 2. Process Classes per Department
  const classesDeptData = (data.classesPerDepartment || []).map((item) => ({
    name: item.departmentName,
    classes: Number(item.totalClasses),
  }));

  // 3. Process Status Wise Classes
  const statusData = (data.classesStatusWise || []).map((item) => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: Number(item.count),
    fill:
      item.status === "active"
        ? "oklch(0.8348 0.1302 160.908)" // Active Green
        : item.status === "inactive"
        ? "oklch(0.6231 0.188 259.8145)" // Inactive Blue/Slate
        : "oklch(0.7686 0.1647 70.0804)", // Archived Amber
  }));

  const totalClassesCount = statusData.reduce((acc, curr) => acc + curr.count, 0);

  // 4. Process Top Teachers
  const teachersData = (data.topTeachers || []).map((item) => ({
    name: item.name,
    classesTaught: Number(item.classCount),
    email: item.email,
  })).reverse(); // Reverse for better top-to-bottom vertical listing in chart

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in pb-8">
      {/* Chart 1: Students Per Department */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">Students per Department</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Distribution of enrolled students across different academic areas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={studentsChartConfig} className="min-h-[300px] w-full">
            <BarChart
              data={studentsData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/45" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] font-medium fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] font-medium fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="students"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Classes Per Department */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">Classes per Department</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Total number of active and inactive classes running in each department.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={classesChartConfig} className="min-h-[300px] w-full">
            <AreaChart
              data={classesDeptData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/45" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] font-medium fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] font-medium fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="classes"
                stroke="var(--color-chart-2)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorClasses)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 3: Classes Status Wise */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs flex flex-col justify-between">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">Class Status Distribution</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Proportion of active, inactive, and archived class rooms.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex items-center justify-center min-h-[300px]">
          <ChartContainer config={statusChartConfig} className="h-[280px] w-full max-w-[320px] mx-auto">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                strokeWidth={3}
                stroke="var(--card)"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-extrabold tracking-tight"
                          >
                            {totalClassesCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider"
                          >
                            Total Classes
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent />} className="text-xs font-semibold" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 4: Top Teachers leaderboard */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">Top Teachers by Classes</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Faculties leading the highest number of active class sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={teachersChartConfig} className="min-h-[300px] w-full">
            <BarChart
              data={teachersData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/45" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                className="text-[11px] font-medium fill-muted-foreground"
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={90}
                className="text-[11px] font-semibold fill-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">{item.payload.email}</span>
                        <div className="flex items-center gap-1.5 mt-1 font-bold text-foreground">
                          <span>Classes:</span>
                          <span className="font-mono">{value}</span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="classesTaught"
                fill="var(--color-chart-5)"
                radius={[0, 6, 6, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ChartsSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
          <CardHeader className="p-0 pb-6 space-y-2">
            <Skeleton className="h-5 w-1/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </CardHeader>
          <CardContent className="p-0 flex items-center justify-center">
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

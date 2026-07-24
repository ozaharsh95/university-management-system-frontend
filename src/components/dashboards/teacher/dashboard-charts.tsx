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

interface ClassStudentData {
  className: string;
  studentsEnrolled: string | number;
}

interface StatusData {
  status: string;
  count: string | number;
}

interface SubjectEnrollmentData {
  subjectName: string;
  studentsEnrolled: string | number;
}

interface UtilizationData {
  className: string;
  utilization: number;
}

export interface TeacherChartsData {
  studentsPerClass?: ClassStudentData[];
  classStatusDistribution?: StatusData[];
  enrollmentBySubject?: SubjectEnrollmentData[];
  capacityUtilization?: UtilizationData[];
}

interface DashboardChartsProps {
  data?: TeacherChartsData;
  isLoading: boolean;
}

// Chart configurations
const studentsChartConfig: ChartConfig = {
  studentsEnrolled: {
    label: "Students",
    color: "var(--color-primary)",
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

const subjectChartConfig: ChartConfig = {
  studentsEnrolled: {
    label: "Students",
    color: "var(--color-chart-2)",
  },
};

const utilizationChartConfig: ChartConfig = {
  utilization: {
    label: "Utilization (%)",
    color: "var(--color-chart-5)",
  },
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading || !data) {
    return <ChartsSkeletonGrid />;
  }

  // 1. Process Students per Class
  const classStudents = (data.studentsPerClass || []).map((item) => ({
    name: item.className.split(" - ")[0], // Truncate class section name for cleaner display
    fullName: item.className,
    studentsEnrolled: Number(item.studentsEnrolled),
  }));

  // 2. Process Class Status Distribution
  const statusData = (data.classStatusDistribution || []).map((item) => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: Number(item.count),
    fill:
      item.status === "active"
        ? "oklch(0.8348 0.1302 160.908)" // Active Green
        : item.status === "inactive"
        ? "oklch(0.6231 0.188 259.8145)" // Inactive Blue/Slate
        : "oklch(0.7686 0.1647 70.0804)", // Archived Amber
  }));

  const totalClassesCount = statusData.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  // 3. Process Enrollment by Subject
  const subjectEnrollments = (data.enrollmentBySubject || []).map((item) => ({
    name: item.subjectName,
    studentsEnrolled: Number(item.studentsEnrolled),
  }));

  // 4. Process Capacity Utilization
  const utilizationData = (data.capacityUtilization || []).map((item) => ({
    name: item.className.split(" - ")[0],
    fullName: item.className,
    utilization: Number(item.utilization),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in pb-8">
      {/* Chart 1: Students Per Class */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">
            Students per Class
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Distribution of enrolled students across your classrooms.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={studentsChartConfig}
            className="min-h-[300px] w-full"
          >
            <BarChart
              data={classStudents}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/45"
              />
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
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.payload.fullName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 font-bold text-foreground">
                          <span>Students:</span>
                          <span className="font-mono">{value}</span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="studentsEnrolled"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Enrollment by Subject */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">
            Enrollment by Subject
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Total active students enrolled under each subject area.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={subjectChartConfig}
            className="min-h-[300px] w-full"
          >
            <BarChart
              data={subjectEnrollments}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                className="stroke-border/45"
              />
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
                width={120}
                className="text-[11px] font-semibold fill-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="studentsEnrolled"
                fill="var(--color-chart-2)"
                radius={[0, 6, 6, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 3: Class Status Distribution */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs flex flex-col justify-between">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">
            Class Status Distribution
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Proportion of active and archived class sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex items-center justify-center min-h-[300px]">
          <ChartContainer
            config={statusChartConfig}
            className="h-[280px] w-full max-w-[320px] mx-auto"
          >
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
              <ChartLegend
                content={<ChartLegendContent />}
                className="text-xs font-semibold"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart 4: Capacity Utilization */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold tracking-tight">
            Capacity Utilization (%)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Percentage of maximum seating capacity filled per class.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={utilizationChartConfig}
            className="min-h-[300px] w-full"
          >
            <AreaChart
              data={utilizationData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorUtilization"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-5)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-5)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/45"
              />
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
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.payload.fullName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 font-bold text-foreground">
                          <span>Utilization:</span>
                          <span className="font-mono">
                            {Number(value).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="utilization"
                stroke="var(--color-chart-5)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorUtilization)"
              />
            </AreaChart>
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
        <Card
          key={index}
          className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs"
        >
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

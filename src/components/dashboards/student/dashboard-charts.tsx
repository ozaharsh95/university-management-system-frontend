import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Pie,
  PieChart,
  Label,
  Cell,
} from "recharts";
import { CalendarRange, Clock, User2 } from "lucide-react";

interface SubjectData {
  subjectName: string;
  classCount: string | number;
}

interface DepartmentClassData {
  departmentName: string;
  classCount: string | number;
}

interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  subjectName: string;
  teacherName: string;
  classId: number;
}

export interface StudentChartsData {
  mySubjects?: SubjectData[];
  classesPerDepartment?: DepartmentClassData[];
  weeklySchedule?: ScheduleItem[];
}

interface DashboardChartsProps {
  data?: StudentChartsData;
  isLoading: boolean;
}

// Chart configurations
const subjectsChartConfig: ChartConfig = {
  classCount: {
    label: "Classes",
    color: "var(--color-primary)",
  },
};

const departmentsChartConfig: ChartConfig = {
  classCount: {
    label: "Classes",
    color: "var(--color-chart-2)",
  },
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

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  isLoading,
}) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Default to today's weekday, fallback to Monday
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const initialDay = daysOfWeek.includes(todayDay) ? todayDay : "Monday";

  const [selectedDay, setSelectedDay] = React.useState(initialDay);

  if (isLoading || !data) {
    return <ChartsSkeletonGrid />;
  }

  // 1. Process My Subjects Pie Chart
  const subjectsData = (data.mySubjects || []).map((item, idx) => {
    // Generate distinct color weights
    const hue = (idx * 137.5) % 360; // Golden ratio color distribution
    return {
      name: item.subjectName,
      count: Number(item.classCount),
      fill: `hsl(${hue}, 70%, 60%)`,
    };
  });

  const totalSubjectsCount = subjectsData.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  // 2. Process Classes per Department Bar Chart
  const departmentData = (data.classesPerDepartment || []).map((item) => ({
    name: item.departmentName.split(" ").slice(0, 2).join(" "), // Truncate name
    classCount: Number(item.classCount),
  }));

  // 3. Process Weekly Schedule
  const scheduleItems = data.weeklySchedule || [];
  const activeDaySchedule = scheduleItems.filter(
    (item) => item.day === selectedDay,
  );

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Distribution */}
        <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-bold tracking-tight">
              Subject Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Proportion of class rooms enrolled across subjects.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex items-center justify-center min-h-[280px]">
            {subjectsData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available</p>
            ) : (
              <ChartContainer
                config={subjectsChartConfig}
                className="h-[260px] w-full max-w-[320px] mx-auto"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={subjectsData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    strokeWidth={3}
                    stroke="var(--card)"
                  >
                    {subjectsData.map((entry, index) => (
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
                                {totalSubjectsCount}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider"
                              >
                                Enrolled Subjects
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
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Classes Per Department */}
        <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-bold tracking-tight">
              Classes per Department
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Total enrolled classes across different academic departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {departmentData.length === 0 ? (
              <div className="flex items-center justify-center min-h-[280px]">
                <p className="text-sm text-muted-foreground">
                  No department classes data found.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={departmentsChartConfig}
                className="min-h-[280px] w-full"
              >
                <BarChart
                  data={departmentData}
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
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="classCount"
                    fill="var(--color-chart-2)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timetable / Weekly Schedule Section */}
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-primary" />
              <span>Weekly Schedule</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Detailed list of scheduled active lectures organized by day.
            </CardDescription>
          </div>

          {/* Weekday Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-muted/40 dark:bg-muted/15 p-1 rounded-lg border border-border/40">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDay === day;
              const hasClasses = scheduleItems.some((item) => item.day === day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer outline-none relative ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <span>{day.substring(0, 3)}</span>
                  {hasClasses && (
                    <span
                      className={`absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-primary-foreground" : "bg-primary"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {activeDaySchedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border/80 bg-muted/5">
              <CalendarRange className="h-10 w-10 text-muted-foreground/60 stroke-[1.5] mb-2 animate-bounce" />
              <p className="font-semibold text-sm text-foreground">
                No classes scheduled
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enjoy your day off!
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-primary/20 ml-3 pl-6 space-y-6 py-2">
              {activeDaySchedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-card border-2 border-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-card" />
                  </div>

                  {/* Scheduled Class Content */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-xs transition-all duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">
                          {item.className}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold py-0 px-2 uppercase tracking-wide"
                        >
                          {item.subjectName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User2 className="h-3.5 w-3.5" />
                        <span>Teacher: {item.teacherName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start md:self-center text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-md px-2.5 py-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {formatTime12h(item.startTime)} -{" "}
                        {formatTime12h(item.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ChartsSkeletonGrid: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={index}
            className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs"
          >
            <CardHeader className="p-0 pb-6 space-y-2">
              <Skeleton className="h-5 w-1/3 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </CardHeader>
            <CardContent className="p-0 flex items-center justify-center">
              <Skeleton className="h-[260px] w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-6 flex items-center justify-between">
          <div className="space-y-2 w-1/3">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <Skeleton className="h-8 w-60 rounded" />
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
};

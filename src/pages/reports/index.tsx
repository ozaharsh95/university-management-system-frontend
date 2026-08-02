import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import {
  FileText,
  Printer,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
} from "lucide-react";
import { useCustom } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { Button } from "@/components/ui/button";

const ReportsPage = () => {
  const { query: overviewQuery } = useCustom<any>({
    url: `${BACKEND_BASE_URL}/stats/admin/overview`,
    method: "get",
  });

  const { query: chartsQuery } = useCustom<any>({
    url: `${BACKEND_BASE_URL}/stats/admin/charts`,
    method: "get",
  });

  const isOverviewLoading = overviewQuery.isLoading;
  const isChartsLoading = chartsQuery.isLoading;

  const overview = overviewQuery.data?.data?.data || {};
  const charts = chartsQuery.data?.data?.data || {};

  const handlePrint = () => {
    window.print();
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const classStatusData =
    charts.classesStatusWise?.map((item: any) => ({
      name: item.status.toUpperCase(),
      value: Number(item.count),
    })) || [];

  return (
    <ListView>
      <div className="flex justify-between items-center print:hidden">
        <div>
          <Breadcrumb />
          <h1 className="page-title font-bold">University Analytics Reports</h1>
          <p className="text-muted-foreground text-sm">
            High-level academic analytics, department allocations, and teacher
            workloads.
          </p>
        </div>
        <Button
          onClick={handlePrint}
          className="flex gap-2 bg-primary hover:bg-primary/95 text-primary-foreground"
        >
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Departments
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.departmentCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Subjects
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.subjectCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Classes
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.classesCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Enrollments
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.enrollmentsCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Students
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.studentCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Teachers
              </p>
              <h3 className="text-xl font-bold mt-0.5">
                {isOverviewLoading ? "..." : overview.teacherCount}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Classes per Department */}
        <Card className="border border-border shadow-sm p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold">
              Classes per Department
            </CardTitle>
            <CardDescription className="text-xs">
              Number of active classes registered within each faculty
              department.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            {isChartsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading charts...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.classesPerDepartment || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis dataKey="departmentName" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="totalClasses"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Students per Department */}
        <Card className="border border-border shadow-sm p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold">
              Students per Department
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of unique student enrollments across departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            {isChartsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading charts...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.studentsPerDepartment || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis dataKey="departmentName" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="totalStudents"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Classes Status Distribution */}
        <Card className="border border-border shadow-sm p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold">
              Class Status Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown of active, inactive, and archived class segments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4 flex justify-center">
            {isChartsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading charts...
              </div>
            ) : classStatusData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No class status data.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {classStatusData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Teacher Workload Analysis */}
        <Card className="border border-border shadow-sm p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold">
              Teacher Workload (Top 5)
            </CardTitle>
            <CardDescription className="text-xs">
              Instructors holding the highest number of assigned classes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            {isChartsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading charts...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.topTeachers || []} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    opacity={0.3}
                  />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="classCount"
                    fill="#FF8042"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default ReportsPage;

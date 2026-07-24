import { useCustom } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import {
  DashboardKpis,
  KpiData,
} from "@/components/dashboards/teacher/dashboard-kpis";
import {
  DashboardCharts,
  TeacherChartsData,
} from "@/components/dashboards/teacher/dashboard-charts";
import {
  DashboardActivity,
  TeacherActivityData,
} from "@/components/dashboards/teacher/dashboard-activity";

interface OverviewResponse {
  success: boolean;
  data: KpiData;
}

interface ChartsResponse {
  success: boolean;
  data: TeacherChartsData;
}

interface ActivityResponse {
  success: boolean;
  data: TeacherActivityData;
}

const TecherDashboard = () => {
  // Fetch overview stats
  const { query: overviewQuery } = useCustom<OverviewResponse>({
    url: `${BACKEND_BASE_URL}stats/teacher/overview`,
    method: "get",
  });

  // Fetch charts data
  const { query: chartsQuery } = useCustom<ChartsResponse>({
    url: `${BACKEND_BASE_URL}stats/teacher/charts`,
    method: "get",
  });

  // Fetch table data
  const { query: tableQuery } = useCustom<ActivityResponse>({
    url: `${BACKEND_BASE_URL}stats/teacher/activity`,
    method: "get",
  });

  const isOverviewLoading = overviewQuery.isLoading;
  const isChartsLoading = chartsQuery.isLoading;
  const isTableActivityLoading = tableQuery.isLoading;

  const overviewData = overviewQuery.data?.data?.data;
  const chartsData = chartsQuery.data?.data?.data;
  const tableActivityData = tableQuery.data?.data?.data;

  console.log({ overviewData, chartsData, tableActivityData });

  return (
    <>
      {/* KPI Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Overview Statistics
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time metrics for your classrooms and total student
              enrollment.
            </p>
          </div>
        </div>

        <DashboardKpis data={overviewData} isLoading={isOverviewLoading} />
      </div>

      {/* Charts Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Analytics & Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Visual graphs of student distribution, class statuses, subject
            counts, and room capacity.
          </p>
        </div>

        <DashboardCharts data={chartsData} isLoading={isChartsLoading} />
      </div>

      {/* Activity Logs Section */}
      <div className="space-y-4 pt-4">
        <DashboardActivity
          data={tableActivityData}
          isLoading={isTableActivityLoading}
        />
      </div>
    </>
  );
};

export default TecherDashboard;

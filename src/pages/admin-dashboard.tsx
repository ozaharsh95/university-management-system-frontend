import { useCustom } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

import {
  DashboardKpis,
  KpiData,
} from "@/components/dashboards/admin/dashboard-kpis";
import {
  DashboardCharts,
  DashboardChartsData,
} from "@/components/dashboards/admin/dashboard-charts";
import {
  DashboardActivity,
  DashboardActivityData,
} from "@/components/dashboards/admin/dashboard-activity";

interface OverviewResponse {
  success: boolean;
  data: KpiData;
}

interface ChartsResponse {
  success: boolean;
  data: DashboardChartsData;
}

interface ActivityResponse {
  success: boolean;
  data: DashboardActivityData;
}

const AdminDashboard = () => {
  // Fetch overview stats
  const { query: overviewQuery } = useCustom<OverviewResponse>({
    url: `${BACKEND_BASE_URL}stats/admin/overview`,
    method: "get",
  });

  // Fetch charts data
  const { query: chartsQuery } = useCustom<ChartsResponse>({
    url: `${BACKEND_BASE_URL}stats/admin/charts`,
    method: "get",
  });

  // Fetch table data
  const { query: tableQuery } = useCustom<ActivityResponse>({
    url: `${BACKEND_BASE_URL}stats/admin/activity`,
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
              Real-time counts across departments, courses, and enrollments.
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
            Visual representations of student enrollment, class metrics, and
            teacher leaderboards.
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

export default AdminDashboard;

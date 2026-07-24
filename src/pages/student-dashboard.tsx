import { useCustom } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import {
  DashboardKpis,
  KpiData,
} from "@/components/dashboards/student/dashboard-kpis";
import {
  DashboardCharts,
  StudentChartsData,
} from "@/components/dashboards/student/dashboard-charts";
import {
  DashboardActivity,
  StudentActivityData,
} from "@/components/dashboards/student/dashboard-activity";

interface OverviewResponse {
  success: boolean;
  data: KpiData;
}

interface ChartsResponse {
  success: boolean;
  data: StudentChartsData;
}

interface ActivityResponse {
  success: boolean;
  data: StudentActivityData;
}

const StudentDashboard = () => {
  // Fetch overview stats
  const { query: overviewQuery } = useCustom<OverviewResponse>({
    url: `${BACKEND_BASE_URL}stats/student/overview`,
    method: "get",
  });

  // Fetch charts & weekly schedule data
  const { query: chartsQuery } = useCustom<ChartsResponse>({
    url: `${BACKEND_BASE_URL}stats/student/charts`,
    method: "get",
  });

  // Fetch activity & timeline data
  const { query: activityQuery } = useCustom<ActivityResponse>({
    url: `${BACKEND_BASE_URL}stats/student/activity`,
    method: "get",
  });

  const isOverviewLoading = overviewQuery.isLoading;
  const isChartsLoading = chartsQuery.isLoading;
  const isActivityLoading = activityQuery.isLoading;

  const overviewData = overviewQuery.data?.data?.data;
  const chartsData = chartsQuery.data?.data?.data;
  const activityData = activityQuery.data?.data?.data;

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
              Real-time counts of your academic courses, subjects, and
              department areas.
            </p>
          </div>
        </div>

        <DashboardKpis data={overviewData} isLoading={isOverviewLoading} />
      </div>

      {/* Charts & Schedule Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Analytics & Timetable
          </h2>
          <p className="text-sm text-muted-foreground">
            Visual graphs of subjects breakdown, departments, and your current
            weekly class schedule.
          </p>
        </div>

        <DashboardCharts data={chartsData} isLoading={isChartsLoading} />
      </div>

      {/* Activity Logs Section */}
      <div className="space-y-4 pt-4">
        <DashboardActivity data={activityData} isLoading={isActivityLoading} />
      </div>
    </>
  );
};

export default StudentDashboard;

import { useCustom, useGetIdentity } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { User } from "@/types";
import { DashboardKpis, KpiData } from "@/components/dashboard-kpis";
import {
  DashboardCharts,
  DashboardChartsData,
} from "@/components/dashboard-charts";
import {
  DashboardActivity,
  DashboardActivityData,
} from "@/components/dashboard-activity";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const Dashboard = () => {
  const { data: user, isLoading: isUserLoading } = useGetIdentity<User>();

  // Fetch overview stats
  const { query: overviewQuery } = useCustom<OverviewResponse>({
    url: `${BACKEND_BASE_URL}stats/overview`,
    method: "get",
  });

  // Fetch charts data
  const { query: chartsQuery } = useCustom<ChartsResponse>({
    url: `${BACKEND_BASE_URL}stats/charts`,
    method: "get",
  });

  // Fetch table data
  const { query: tableQuery } = useCustom<ActivityResponse>({
    url: `${BACKEND_BASE_URL}stats/activity`,
    method: "get",
  });

  const isOverviewLoading = overviewQuery.isLoading;
  const isChartsLoading = chartsQuery.isLoading;
  const isTableActivityLoading = tableQuery.isLoading;

  const overviewData = overviewQuery.data?.data?.data;
  const chartsData = chartsQuery.data?.data?.data;
  const tableActivityData = tableQuery.data?.data?.data;

  console.log({ overviewData, chartsData, tableActivityData });

  // Get current hour to decide greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-primary/10 to-transparent p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{getGreeting()},</span>{" "}
              {isUserLoading ? (
                <Skeleton className="h-8 w-32 inline-block align-middle" />
              ) : (
                <span className="text-primary font-extrabold">
                  {user?.name ?? "User"}
                </span>
              )}
              <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse inline-block" />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Welcome back to your University Management dashboard. Here is a
              summary of the current campus activities.
            </p>
          </div>
          {!isUserLoading && user?.role && (
            <div className="self-start md:self-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/25">
                System {user.role}
              </span>
            </div>
          )}
        </div>
        {/* Decorative background glow elements */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl opacity-40 pointer-events-none" />
      </div>

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
        <DashboardActivity data={tableActivityData} isLoading={isTableActivityLoading} />
      </div>
    </div>
  );
};

export default Dashboard;

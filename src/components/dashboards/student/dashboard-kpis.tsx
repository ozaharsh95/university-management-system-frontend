import React from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardList,
  LucideIcon,
} from "lucide-react";

export interface KpiData {
  myClasses?: number;
  departmentsCount?: number;
  subjectsCount?: number;
  activeClasses?: number;
}

interface DashboardKpisProps {
  data?: KpiData;
  isLoading: boolean;
}

interface KpiCardConfig {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
  linkTo?: string;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading || !data) {
    return <KpiSkeletonGrid />;
  }

  const kpis: KpiCardConfig[] = [
    {
      title: "Enrolled Classes",
      value: data?.myClasses ?? 0,
      icon: GraduationCap,
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-500/10 dark:bg-violet-500/15",
      borderClass: "hover:border-violet-500/40",
      description: "Classes you are enrolled in",
      linkTo: "/classes",
    },
    {
      title: "Departments",
      value: data?.departmentsCount ?? 0,
      icon: Building2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderClass: "hover:border-emerald-500/40",
      description: "Academic divisions offering classes",
    },
    {
      title: "Subjects",
      value: data?.subjectsCount ?? 0,
      icon: BookOpen,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
      borderClass: "hover:border-blue-500/40",
      description: "Distinct subject fields",
      linkTo: "/subjects",
    },
    {
      title: "Active Classes",
      value: data?.activeClasses ?? 0,
      icon: ClipboardList,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
      borderClass: "hover:border-amber-500/40",
      description: "Ongoing active class sessions",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const CardInner = (
          <>
            <CardContent className="p-0 flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {kpi.value}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-normal">
                  {kpi.description}
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${kpi.bgClass} ${kpi.colorClass}`}
              >
                <Icon className="h-6 w-6 stroke-[2]" />
              </div>
            </CardContent>

            {/* Premium indicator light effect on top border */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-transparent via-current to-transparent ${kpi.colorClass}`}
            />
          </>
        );

        const cardClassName = `group block relative rounded-xl border border-border/60 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${kpi.borderClass}`;

        if (kpi.linkTo) {
          return (
            <Link
              key={index}
              to={kpi.linkTo}
              className={`${cardClassName} cursor-pointer`}
            >
              {CardInner}
            </Link>
          );
        }

        return (
          <div key={index} className={cardClassName}>
            {CardInner}
          </div>
        );
      })}
    </div>
  );
};

const KpiSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-xl border border-border/60 bg-card p-6 shadow-xs"
        >
          <CardContent className="p-0 flex items-start justify-between">
            <div className="space-y-3 w-3/4">
              {/* Title skeleton */}
              <Skeleton className="h-4 w-1/2 rounded" />
              {/* Count skeleton */}
              <Skeleton className="h-8 w-1/3 rounded" />
              {/* Description skeleton */}
              <Skeleton className="h-3 w-5/6 rounded" />
            </div>
            {/* Icon skeleton */}
            <Skeleton className="h-12 w-12 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

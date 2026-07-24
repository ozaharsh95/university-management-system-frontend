import React from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Users,
  Award,
  LucideIcon,
} from "lucide-react";

export interface KpiData {
  departmentCount?: string;
  subjectCount?: string;
  classesCount?: string;
  enrollmentsCount?: string;
  studentCount?: string;
  teacherCount?: string;
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
      title: "Departments",
      value: data?.departmentCount ?? "0",
      icon: Building2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderClass: "hover:border-emerald-500/40",
      description: "Academic & administrative areas",
    },
    {
      title: "Subjects",
      value: data?.subjectCount ?? "0",
      icon: BookOpen,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
      borderClass: "hover:border-blue-500/40",
      description: "Curriculum modules offered",
      linkTo: "/subjects",
    },
    {
      title: "Classes",
      value: data?.classesCount ?? "0",
      icon: GraduationCap,
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-500/10 dark:bg-violet-500/15",
      borderClass: "hover:border-violet-500/40",
      description: "Active class schedules",
      linkTo: "/classes",
    },
    {
      title: "Enrollments",
      value: data?.enrollmentsCount ?? "0",
      icon: ClipboardList,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
      borderClass: "hover:border-amber-500/40",
      description: "Total course registrations",
    },
    {
      title: "Students",
      value: data?.studentCount ?? "0",
      icon: Users,
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-500/10 dark:bg-rose-500/15",
      borderClass: "hover:border-rose-500/40",
      description: "Enrolled active learners",
    },
    {
      title: "Teachers",
      value: data?.teacherCount ?? "0",
      icon: Award,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-500/10 dark:bg-indigo-500/15",
      borderClass: "hover:border-indigo-500/40",
      description: "Faculty & instructors",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-fade-in">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: 6 }).map((_, index) => (
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

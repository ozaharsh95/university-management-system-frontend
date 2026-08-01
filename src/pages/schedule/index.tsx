import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, Clock, User2, BookOpen } from "lucide-react";
import { useGetIdentity, useCustom } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { User, UserRole, Schedule } from "@/types";

interface UnifiedScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  subjectName: string;
  teacherName: string;
  classId: number;
}

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

const SchedulePage = () => {
  const { data: user } = useGetIdentity<User>();
  const role = user?.role;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [scheduleItems, setScheduleItems] = useState<UnifiedScheduleItem[]>([]);

  // Fetch student schedule data
  const { query: studentQuery } = useCustom<any>({
    url: `${BACKEND_BASE_URL}stats/student/charts`,
    method: "get",
    queryOptions: {
      enabled: role === UserRole.STUDENT,
    },
  });

  // Fetch classes for teacher / admin
  const { query: classesQuery } = useCustom<any>({
    url: `${BACKEND_BASE_URL}classes`,
    method: "get",
    config: {
      query: role === UserRole.TEACHER ? {
        teacherId: user?.id,
        limit: 100,
      } : undefined,
    },
    queryOptions: {
      enabled: role === UserRole.TEACHER || role === UserRole.ADMIN,
    },
  });

  const isStudentLoading = studentQuery.isLoading;
  const isClassesLoading = classesQuery.isLoading;
  const studentChartsData = studentQuery.data;
  const classesData = classesQuery.data;

  useEffect(() => {
    if (role === UserRole.STUDENT && studentChartsData?.data?.data?.weeklySchedule) {
      setScheduleItems(studentChartsData.data.data.weeklySchedule);
    } else if ((role === UserRole.TEACHER || role === UserRole.ADMIN) && classesData?.data?.data) {
      const allClassItems = classesData.data.data;
      const formattedItems: UnifiedScheduleItem[] = [];

      allClassItems.forEach((cls: any) => {


        if (Array.isArray(cls.schedules)) {
          cls.schedules.forEach((sch: Schedule) => {
            formattedItems.push({
              day: sch.day,
              startTime: sch.startTime,
              endTime: sch.endTime,
              className: cls.name,
              subjectName: cls.subject?.name || "N/A",
              teacherName: cls.teacher?.name || "N/A",
              classId: cls.id,
            });
          });
        }
      });

      // Sort items by start time
      formattedItems.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setScheduleItems(formattedItems);
    }
  }, [role, studentChartsData, classesData, user]);

  const activeDaySchedule = scheduleItems.filter(
    (item) => item.day.toLowerCase() === selectedDay.toLowerCase()
  );

  const isLoading = isStudentLoading || isClassesLoading;

  return (
    <ListView>
      <Breadcrumb />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title font-bold">Academic Schedule</h1>
          <p className="text-muted-foreground text-sm">
            View details of scheduled classes and lectures sorted by weekdays.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <CardHeader className="p-0 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-primary" />
                <span>Timetable Grid</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Click a day to view its specific timeline.
              </CardDescription>
            </div>

            {/* Weekday Selector Tabs */}
            <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day;
                const hasClasses = scheduleItems.some(
                  (item) => item.day.toLowerCase() === day.toLowerCase()
                );
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span>{day.substring(0, 3)}</span>
                    {hasClasses && (
                      <span
                        className={`absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground animate-pulse">Loading schedule...</p>
              </div>
            ) : activeDaySchedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border/80 bg-muted/5">
                <CalendarRange className="h-12 w-12 text-muted-foreground/40 stroke-[1.5] mb-3 animate-pulse" />
                <p className="font-semibold text-foreground text-sm">No classes scheduled</p>
                <p className="text-xs text-muted-foreground mt-1">Enjoy your day off!</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-primary/25 ml-4 pl-6 space-y-6 py-2">
                {activeDaySchedule.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Dot Indicator */}
                    <div className="absolute -left-[32px] top-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-background" />
                    </div>

                    {/* Scheduled Class Content */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-foreground">{item.className}</h4>
                          <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                            {item.subjectName}
                          </Badge>
                        </div>
                        {role !== UserRole.TEACHER && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User2 className="h-3.5 w-3.5" />
                            <span>Teacher: {item.teacherName}</span>
                          </div>
                        )}
                        {role === UserRole.ADMIN && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/75">
                            <BookOpen className="h-3 w-3" />
                            <span>Class ID: {item.classId}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 self-start md:self-center text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
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
    </ListView>
  );
};

export default SchedulePage;

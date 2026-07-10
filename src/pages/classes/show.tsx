import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";

const ClassesShow = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query?.data?.data;

  const { isLoading, isError } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class details" />

        <p className="state-message">
          {isLoading
            ? "Loading class details ... "
            : isError
            ? "Failed to load class details ..."
            : "Class details not found"}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails?.teacher?.name ?? "Unknown";

  const teachersInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placedholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teachersInitials || "NA",
  )}`;

  const {
    name,
    capacity,
    courseCode,
    courseName,
    description,
    id,
    schedules,
    status,
    bannerCldPubId,
    bannerUrl,
    department,
    inviteCode,
    subject,
    teacher,
  } = classDetails;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class details" />

      <div className="banner">
        {bannerUrl ? (
          <AdvancedImage
            alt="class banner"
            cldImg={bannerPhoto(bannerCldPubId ?? "", name)}
          />
        ) : (
          <div className="placeholder"></div>
        )}
      </div>

      <Card className="details-card">
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>

          <div>
            <Badge variant={"outline"}>{capacity} spots</Badge>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              data-status={status}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="details-grid">
          <div className="instructor">
            <p>Instructor</p>
            <div>
              <img src={teacher?.image ?? placedholderUrl} alt={teacherName} />

              <div>
                <p>{teacherName}</p>
                <p>{teacher?.email}</p>
              </div>
            </div>
          </div>

          <div className="department">
            <p>Department</p>

            <div>
              <p>{department?.name}</p>
              <p>{department?.description}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="subject">
          <p>Subject</p>

          <div>
            <Badge variant={"outline"}>Code: {subject?.code}</Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        <div className="join">
          <h2>Join Class</h2>
          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size={"lg"} className="w-full">
          Join class
        </Button>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;

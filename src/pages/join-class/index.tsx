import { useState } from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomMutation } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { toast } from "sonner";

const JoinClass = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const { mutate, mutation } = useCustomMutation<any>();
  const isLoading = mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    mutate(
      {
        url: `${BACKEND_BASE_URL}enrollments/join`,
        method: "post",
        values: {
          inviteCode: inviteCode.trim(),
        },
      },
      {
        onSuccess: (response: any) => {
          setSuccessData(response.data?.data);
          toast.success(response.data?.message || "Successfully joined the class!");
          setInviteCode("");
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.error || "Failed to join class. Please check your code.";
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title font-bold">Join Class</h1>
      <p className="text-muted-foreground text-sm">
        Connect to your course classrooms by typing in the code.
      </p>

      <div className="flex justify-center items-center mt-12">
        <Card className="w-full max-w-md border-primary/20 bg-linear-to-br from-card to-background shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Enter Invite Code</CardTitle>
            <CardDescription>
              Invite codes are usually 7 characters long containing letters and numbers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!successData ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 7a3b8cd"
                    className="h-12 text-center text-lg font-mono tracking-widest uppercase focus-visible:ring-primary"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Validating code..." : "Join Classroom"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-foreground">Enrollment Confirmed</h3>
                  <p className="text-sm text-muted-foreground">
                    You have successfully registered for the class:
                  </p>
                  <p className="font-semibold text-primary text-base mt-2">
                    Class ID: {successData.classId}
                  </p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setSuccessData(null)}>
                  Join Another Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default JoinClass;

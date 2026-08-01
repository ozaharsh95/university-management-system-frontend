import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useGetIdentity } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";
import UploadWidget from "@/components/upload-widget";
import { User as UserType } from "@/types";
import { toast } from "sonner";

const ProfilePage = () => {
  const { data: user, refetch } = useGetIdentity<UserType>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<{ url: string; publicId: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      if (user.image) {
        setAvatar({
          url: user.image,
          publicId: user.imageCldPubId || "",
        });
      } else {
        setAvatar(null);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      const updatePayload: any = {
        name: name.trim(),
      };

      if (avatar) {
        updatePayload.image = avatar.url;
        updatePayload.imageCldPubId = avatar.publicId;
      } else {
        updatePayload.image = "";
        updatePayload.imageCldPubId = "";
      }

      const { data, error } = await authClient.updateUser(updatePayload) as any;

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      if (data?.user) {
        // Sync local storage user
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated successfully!");
        refetch(); // Reload identity in Refine context
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title font-bold">My Profile</h1>
      <p className="text-muted-foreground text-sm">
        View and update your account settings and credentials.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Profile Card View */}
        <Card className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center justify-center">
          <Avatar className="h-28 w-28 border-2 border-primary/20 shadow-md">
            <AvatarImage src={avatar?.url} alt={name} />
            <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="mt-4 space-y-1.5">
            <h2 className="font-bold text-lg text-foreground">{user?.name}</h2>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <div className="pt-2">
              <Badge className="uppercase tracking-wider font-semibold text-[10px] px-3 py-1">
                {user?.role}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Update Profile Form */}
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Account Information</CardTitle>
            <CardDescription className="text-xs">
              Make changes to your display name, and avatar picture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    placeholder="email@university.edu"
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Profile Photo</Label>
                <UploadWidget
                  value={avatar}
                  onChange={(val) => setAvatar(val)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving changes..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default ProfilePage;

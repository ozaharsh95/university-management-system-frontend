import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  BookOpen,
  Info,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useList,
  useCreate,
  useDelete,
  useGetIdentity,
  useNotification,
} from "@refinedev/core";
import { User, UserRole } from "@/types";

type Announcement = {
  id: number;
  title: string;
  content: string;
  category: "holiday" | "urgent" | "academic" | "general";
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

const AnnouncementsList = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", category: "general" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data: currentUser } = useGetIdentity<User>();
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const { open } = useNotification();

  const { mutate: createMutate, mutation: createMutation } = useCreate();
  const isCreating = createMutation.isPending;
  const { mutate: deleteMutate } = useDelete();

  const activeFilters = useMemo(() => {
    const filters = [];
    if (categoryFilter !== "all") {
      filters.push({
        field: "category",
        operator: "eq" as const,
        value: categoryFilter,
      });
    }
    return filters;
  }, [categoryFilter]);

  const { query } = useList<Announcement>({
    resource: "announcements",
    pagination: {
      currentPage,
      pageSize,
    },
    filters: activeFilters,
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
  });

  const announcementsList = query.data?.data ?? [];
  const totalItems = query.data?.total ?? 0;
  const isLoading = query.isLoading;
  const refetch = query.refetch;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    createMutate(
      {
        resource: "announcements",
        values: formData,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Announcement posted",
            description: "The global announcement was published successfully.",
          });
          setIsCreateOpen(false);
          setFormData({ title: "", content: "", category: "general" });
          refetch();
        },
        onError: (error) => {
          open?.({
            type: "error",
            message: "Failed to post announcement",
            description: error.message || "An error occurred.",
          });
        },
      },
    );
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    deleteMutate(
      {
        resource: "announcements",
        id,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Announcement deleted",
            description: "The announcement has been deleted.",
          });
          refetch();
        },
        onError: (error) => {
          open?.({
            type: "error",
            message: "Failed to delete announcement",
            description: error.message || "An error occurred.",
          });
        },
      },
    );
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "urgent":
        return {
          badge: "bg-red-500/10 text-red-500 border-red-500/25 animate-pulse",
          card: "border-red-500/30 bg-linear-to-br from-red-500/5 to-transparent",
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        };
      case "holiday":
        return {
          badge: "bg-amber-500/10 text-amber-500 border-amber-500/25",
          card: "border-amber-500/30 bg-linear-to-br from-amber-500/5 to-transparent",
          icon: <Calendar className="h-5 w-5 text-amber-500" />,
        };
      case "academic":
        return {
          badge: "bg-blue-500/10 text-blue-500 border-blue-500/25",
          card: "border-blue-500/25",
          icon: <BookOpen className="h-5 w-5 text-blue-500" />,
        };
      default:
        return {
          badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          card: "border-border",
          icon: <Info className="h-5 w-5 text-slate-400" />,
        };
    }
  };

  return (
    <ListView>
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <span>Global Announcement Hub</span>
            <Megaphone className="h-6 w-6 text-primary fill-primary/10" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with the latest alerts, holiday notices, and academic schedules on campus.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 self-start sm:self-center">
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center gap-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Label htmlFor="category-select" className="text-xs text-muted-foreground">Category Filter:</Label>
          <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}>
            <SelectTrigger id="category-select" className="w-[160px] h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Announcements</SelectItem>
              <SelectItem value="urgent">Urgent Alerts</SelectItem>
              <SelectItem value="holiday">Holiday Notices</SelectItem>
              <SelectItem value="academic">Academic Notices</SelectItem>
              <SelectItem value="general">General Updates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse border-border">
              <CardHeader className="h-20 bg-muted/40 rounded-t-lg" />
              <CardContent className="h-32 bg-muted/20" />
            </Card>
          ))}
        </div>
      ) : announcementsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {announcementsList.map((announcement: Announcement) => {
            const styles = getCategoryStyles(announcement.category);
            const authorName = announcement.author?.name || "Campus Administration";
            const initials = authorName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((p: string) => p[0]?.toUpperCase())
              .join("");

            return (
              <Card
                key={announcement.id}
                className={`flex flex-col justify-between transition-all duration-200 hover:shadow-md ${styles.card}`}
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant="outline" className={`capitalize ${styles.badge}`}>
                        <span className="mr-1">{styles.icon}</span>
                        {announcement.category}
                      </Badge>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground leading-tight mt-3">
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {announcement.content}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="pt-3 border-t border-border bg-muted/5 rounded-b-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={announcement.author?.image} alt={authorName} />
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                      {authorName}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Megaphone className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-lg">No announcements found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            There are no announcements published in this category at the moment.
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <span className="text-xs text-muted-foreground mr-2">
            Page {currentPage} of {totalPages} ({totalItems} announcements)
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publish Announcement</DialogTitle>
            <DialogDescription>
              This announcement will be broadcasted to all students, teachers, and admins.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                placeholder="e.g. Independence Day Campus Holiday"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger id="announcement-category" className="capitalize">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Update</SelectItem>
                  <SelectItem value="holiday">Holiday Notice</SelectItem>
                  <SelectItem value="urgent">Urgent Alert</SelectItem>
                  <SelectItem value="academic">Academic Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-content">Announcement Content</Label>
              <Textarea
                id="announcement-content"
                placeholder="Type the message or details here..."
                className="min-h-[120px]"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Publishing..." : "Publish Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ListView>
  );
};

export default AnnouncementsList;

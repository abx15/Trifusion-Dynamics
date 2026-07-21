"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/lib/toast";
import { UserCheck, ShieldAlert, BadgeCheck, CircleAlert } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "ACTIVE" | "INACTIVE";
}

export default function UsersSettingsPage() {
  const { isAdmin, hasPermission } = useAuth();
  
  const [members, setMembers] = React.useState<Member[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mock initial list of users linked to the tenant organization
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMembers([
        {
          id: "usr_1",
          name: "Arun Kumar",
          email: "arun@trifusiondynamics.com",
          roles: ["admin"],
          status: "ACTIVE",
        },
        {
          id: "usr_2",
          name: "Sanjay Sharma",
          email: "sanjay@trifusiondynamics.com",
          roles: ["developer"],
          status: "ACTIVE",
        },
        {
          id: "usr_3",
          name: "Deepa Nair",
          email: "deepa@trifusiondynamics.com",
          roles: ["hr"],
          status: "ACTIVE",
        },
        {
          id: "usr_4",
          name: "Rohan Das",
          email: "rohan@trifusiondynamics.com",
          roles: ["client"],
          status: "ACTIVE",
        },
        {
          id: "usr_5",
          name: "Vikas Patel",
          email: "vikas@trifusiondynamics.com",
          roles: ["developer"],
          status: "INACTIVE",
        },
      ]);
      setIsLoading(false);
    }, 600); // 600ms simulated network delay to display skeletons

    return () => clearTimeout(timer);
  }, []);

  const handleDeactivate = (id: string, name: string) => {
    // Check permission
    if (!isAdmin) {
      toast.error("Access denied: Admin permissions required");
      return;
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "INACTIVE" } : m))
    );
    toast.success(`Deactivated team member: ${name}`);
  };

  const handleActivate = (id: string, name: string) => {
    if (!isAdmin) {
      toast.error("Access denied: Admin permissions required");
      return;
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "ACTIVE" } : m))
    );
    toast.success(`Activated team member: ${name}`);
  };

  const handleRoleChange = (id: string, name: string, currentRole: string) => {
    if (!isAdmin) {
      toast.error("Access denied: Admin permissions required");
      return;
    }

    const nextRole = currentRole === "developer" ? "admin" : "developer";
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, roles: [nextRole] } : m))
    );
    toast.success(`Updated role for ${name} to ${nextRole}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Users" }]}
      />

      <Card className="bg-white dark:bg-zinc-900 border border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Workspace Users</CardTitle>
            <CardDescription>
              Manage security access, roles, and session states for members within your organization.
            </CardDescription>
          </div>
          {isAdmin && (
            <Button size="sm" onClick={() => toast.info("Add user flow coming in Phase F3.")}>
              Invite Member
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Access Roles</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  // Skeleton state loaders matching dense page parameters
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="h-14">
                      <td className="py-2.5 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-2.5 px-4"><Skeleton className="h-4 w-48" /></td>
                      <td className="py-2.5 px-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-2.5 px-4 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="py-2.5 px-4 text-right"><Skeleton className="h-7 w-28 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-3.5 px-4 font-medium text-foreground">{member.name}</td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono text-xs">{member.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold uppercase font-mono">
                          {member.roles.join(", ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {member.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                            <BadgeCheck className="h-4 w-4 shrink-0" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-medium text-xs">
                            <CircleAlert className="h-4 w-4 shrink-0" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {isAdmin ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleChange(member.id, member.name, member.roles[0])}
                            >
                              Toggle Role
                            </Button>
                            {member.status === "ACTIVE" ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeactivate(member.id, member.name)}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleActivate(member.id, member.name)}
                              >
                                Activate
                              </Button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">// Action Locked</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

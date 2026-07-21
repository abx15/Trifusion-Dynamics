"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Inbox, User2, Mail, Phone, Building2, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useCreateLead } from "@/lib/hooks/useLeads";
import { toast } from "@/lib/toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  createdAt: string;
}

export default function LeadsInboxPage() {
  const router = useRouter();
  const createLead = useCreateLead();
  const [promoting, setPromoting] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["leads-inbox"],
    queryFn: async () => {
      const { data } = await apiClient.get("/crm/contact-submissions");
      return data as { data: ContactSubmission[]; total: number };
    },
    staleTime: 60_000,
  });

  const handlePromote = async (sub: ContactSubmission) => {
    setPromoting(sub.id);
    try {
      const lead = await createLead.mutateAsync({
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        company: sub.company,
        notes: sub.message,
        source: sub.source ?? "Website",
        stage: "NEW",
      });
      toast.success(`${sub.name} promoted to lead`);
      router.push(`/crm/leads/${lead.id}`);
    } catch {
      toast.error("Failed to promote to lead");
    } finally {
      setPromoting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Leads Inbox</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Public contact form submissions — review and promote to CRM pipeline
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No submissions yet. The inbox is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.data ?? []).map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {sub.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {sub.email}
                    </span>
                  )}
                  {sub.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {sub.phone}
                    </span>
                  )}
                  {sub.company && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {sub.company}
                    </span>
                  )}
                </div>

                {sub.message && (
                  <p className="text-sm text-foreground line-clamp-2 bg-slate-50 dark:bg-zinc-900/60 rounded-lg px-3 py-2">
                    {sub.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => handlePromote(sub)}
                disabled={promoting === sub.id}
                className="flex items-center gap-2 shrink-0 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-2 text-xs font-semibold transition-all disabled:opacity-60"
              >
                {promoting === sub.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Promote to Lead
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

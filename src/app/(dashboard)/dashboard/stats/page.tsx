import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { StatsCharts } from "@/components/analytics/stats-charts";

export default async function StatsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase.rpc("get_author_daily_stats");

  if (error) {
    console.error("Stats fetch error:", error);
    throw error;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stats</h1>

          <p className="text-muted-foreground">
            Performance of your posts over the last 14 days.
          </p>
        </div>
      </div>

      <div className="w-full min-w-0">
        <StatsCharts data={data ?? []} />
      </div>
    </div>
  );
}

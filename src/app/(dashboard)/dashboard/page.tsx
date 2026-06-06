import { FeedList } from "@/components/feed/feed-list";
import { FollowedTags } from "@/components/tags/followed-tags";
import { SuggestedTags } from "@/components/tags/suggested-tags";

export default async function DashboardLayoutPreview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="text-muted-foreground">
                Manage your writing, monitor engagement, and discover new
                stories.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AnalyticsCard title="" value="" change="" />

              <AnalyticsCard title="" value="" change="" />

              <AnalyticsCard title="" value="" change="" />

              <AnalyticsCard title="" value="" change="" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Recent Articles</h3>
                    <p className="text-sm text-muted-foreground">
                      Latest published articles.
                    </p>
                  </div>
                </div>

                <FeedList />
              </div>

              <aside className="hidden space-y-4 lg:block">
                <FollowedTags />

                <SuggestedTags />
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>

      <div className="mt-3 flex items-end justify-between">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>

        <span className="text-sm font-medium">{change}</span>
      </div>
    </div>
  );
}

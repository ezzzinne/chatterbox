import { createClient } from "@/lib/server";
import { Route } from "next";
import Link from "next/link";

export default async function DashboardLayoutPreview() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, published_at, views")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    return <div>Error loading posts</div>;
  }

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

                {/* <div className="space-y-4">
                  {posts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      title={post.title}
                      status={post.published_at}
                      views={post.views}
                    />
                  ))}
                </div> */}
                <div className="grid gap-4">
                  {posts?.map((post) => (
                    <Link
                      key={post.id}
                      href={`/dashboard/articles/${post.id}` as Route}
                      className="rounded-xl border p-4 transition hover:bg-muted/50"
                    >
                      <h2 className="font-semibold">{post.title}</h2>

                      {post.excerpt && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Trending Tags</h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {/* hardcoded tags */}
                  {[
                    "Technology",
                    "Writing",
                    "Design",
                    "Productivity",
                    "Frontend",
                    "AI",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
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

function ArticleCard({
  title,
  status,
  views,
}: {
  title: string;
  status: string;
  views: string;
}) {
  return (
    <div className="rounded-2xl border p-4 transition hover:bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-medium leading-snug">{title}</h4>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{status}</span>
            <span>•</span>
            <span>{views}</span>
          </div>
        </div>

        <button className="rounded-xl border px-3 py-2 text-sm transition hover:bg-muted">
          Edit
        </button>
      </div>
    </div>
  );
}

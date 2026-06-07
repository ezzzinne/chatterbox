import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Route } from "next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ArticlesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: articles } = await supabase
    .from("posts")
    .select("id, title, excerpt, published_at")
    .eq("author_id", user.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>

          <p className="text-muted-foreground">
            View and manage your published articles.
          </p>
        </div>
      </div>

      {!articles?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">No published articles</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              When you publish articles, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((post) => (
            <Card key={post.id} className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="line-clamp-1">{post.title}</CardTitle>

                {post.excerpt && (
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                {post.published_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </div>
                )}
                <Link href={`/dashboard/articles/${post.id}` as Route}>
                  <Button variant="default" className="font-medium">
                    Read
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

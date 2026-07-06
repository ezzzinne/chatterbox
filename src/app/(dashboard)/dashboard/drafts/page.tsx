import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Route } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FileText, Pencil } from "lucide-react";

export default async function DraftsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: drafts } = await supabase
    .from("posts")
    .select("id, title, excerpt, updated_at")
    .eq("author_id", user.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>

          <p className="text-muted-foreground">
            Continue working on unpublished articles.
          </p>
        </div>
      </div>

      {!drafts?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">No drafts found</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Start writing and your drafts will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((post) => (
            <Link key={post.id} href={`/dashboard/drafts/${post.id}` as Route}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <CardTitle className="line-clamp-1">
                      {post.title || "Untitled"}
                    </CardTitle>
                  </div>

                  {post.excerpt && (
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Pencil className="h-4 w-4" />
                    Updated {new Date(post.updated_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

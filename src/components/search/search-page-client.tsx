"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";

import type { SearchPost } from "@/actions/search";

type SearchPageClientProps = {
  query: string;
  results: SearchPost[];
};

export function SearchPageClient({ query, results }: SearchPageClientProps) {
  const router = useRouter();

  const hasQuery = query.trim().length >= 2;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Search</h1>

          {!hasQuery ? (
            <p className="text-muted-foreground">
              Find articles by title, keyword, author, or tag.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Showing results for{" "}
              <span className="font-medium text-foreground">
                &quot;{query}&quot;
              </span>
            </p>
          )}
        </div>
      </div>

      {!hasQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">Search for articles</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Enter a title, keyword, author, or tag in the search bar above to
            begin.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">No results found</h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find any articles matching
            <span className="font-medium text-foreground">
              {" "}
              &quot;{query}&quot;
            </span>
            .
          </p>

          <Button
            variant="outline"
            className="mt-6"
            onClick={() => router.push("/dashboard")}
          >
            Browse Articles
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground mb-2">
            {results.length} result
            {results.length !== 1 ? "s" : ""}
          </div>

          <div className="space-y-4">
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

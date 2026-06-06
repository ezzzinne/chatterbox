import { searchPostsAction } from "@/actions/search";
import { SearchPageClient } from "@/components/search/search-page-client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; from?: string }>;
}) {
  const { q } = await searchParams;

  const results = q && q.trim().length >= 2 ? await searchPostsAction(q) : [];

  return <SearchPageClient query={q ?? ""} results={results} />;
}

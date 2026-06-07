export type AnalyticsEvent = {
  event_type: "view" | "like" | "comment" | "bookmark";
  user_id: string | null;
  session_id: string | null;
};

export function aggregateAnalytics(events: AnalyticsEvent[]) {
  const views = events.filter((event) => event.event_type === "view");

  const uniqueReaders = new Set(
    views.map((event) => event.user_id ?? event.session_id).filter(Boolean),
  ).size;

  return {
    views: views.length,
    unique_readers: uniqueReaders,
    likes: events.filter((event) => event.event_type === "like").length,
    comments: events.filter((event) => event.event_type === "comment").length,
    bookmarks: events.filter((event) => event.event_type === "bookmark").length,
  };
}

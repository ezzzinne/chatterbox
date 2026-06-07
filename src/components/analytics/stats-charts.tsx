"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DailyStat = {
  day: string;
  views: number;
  unique_readers: number;
  likes: number;
  comments: number;
  bookmarks: number;
};

type Props = {
  data: DailyStat[];
};

function sumMetric(data: DailyStat[], metric: keyof Omit<DailyStat, "day">) {
  return data.reduce((sum, row) => sum + Number(row[metric] ?? 0), 0);
}

function getChangePercent(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;

  return ((current - previous) / previous) * 100;
}

export function StatsCharts({ data }: Props) {
  console.log("StatsCharts raw data:", data);

  const normalizedData = data.map((row) => ({
    day: new Date(row.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    views: Number(row.views ?? 0),
    unique_readers: Number(row.unique_readers ?? 0),
    likes: Number(row.likes ?? 0),
    comments: Number(row.comments ?? 0),
    bookmarks: Number(row.bookmarks ?? 0),
  }));

  console.log("StatsCharts normalized data:", normalizedData);

  const previous7 = normalizedData.slice(0, 7);
  const last7 = normalizedData.slice(7, 14);

  const hasAnyData = normalizedData.some(
    (row) =>
      row.views > 0 ||
      row.unique_readers > 0 ||
      row.likes > 0 ||
      row.comments > 0 ||
      row.bookmarks > 0,
  );

  const metricCards = [
    { label: "Views", key: "views" },
    { label: "Unique Readers", key: "unique_readers" },
    { label: "Likes", key: "likes" },
    { label: "Comments", key: "comments" },
    { label: "Bookmarks", key: "bookmarks" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((metric) => {
          const current = sumMetric(last7, metric.key);
          const previous = sumMetric(previous7, metric.key);
          const change = getChangePercent(current, previous);

          return (
            <div key={metric.key} className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>

              <p className="mt-2 text-2xl font-bold">{current}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}% vs previous 7 days
              </p>
            </div>
          );
        })}
      </div>

      {!hasAnyData && (
        <div className="rounded-xl border bg-muted/30 p-6 text-center">
          <p className="font-medium">No analytics data to chart yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your charts will appear once your articles receive views, likes,
            comments, or bookmarks.
          </p>
        </div>
      )}

      <div className="w-full min-w-0 rounded-xl border bg-card p-5">
        <h2 className="mb-4 font-semibold">Views and unique readers</h2>

        <div className="relative h-[320px] w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={300}
          >
            <LineChart data={normalizedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="#2563eb"
                strokeWidth={2}
                dot
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="unique_readers"
                name="Unique readers"
                stroke="#16a34a"
                strokeWidth={2}
                dot
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-xl border bg-card p-5">
        <h2 className="mb-4 font-semibold">
          Engagement: likes, comments, bookmarks
        </h2>

        <div className="relative h-[320px] w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={300}
          >
            <BarChart data={normalizedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="Likes" fill="#ef4444" />
              <Bar dataKey="comments" name="Comments" fill="#f59e0b" />
              <Bar dataKey="bookmarks" name="Bookmarks" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

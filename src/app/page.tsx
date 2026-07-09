import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpenText,
  Check,
  Edit3,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Tags,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Audience", href: "#audience" },
];

const feedPosts = [
  {
    title: "How I structure Supabase apps for content-heavy products",
    excerpt:
      "A practical look at drafts, article views, notifications, and analytics in one publishing flow.",
    tags: ["Supabase", "Architecture"],
    stats: { likes: 128, comments: 24, bookmarks: 41 },
  },
  {
    title: "A writer's guide to markdown previews",
    excerpt:
      "Ship cleaner posts by moving from draft to preview before publishing to your readers.",
    tags: ["Writing", "Markdown"],
    stats: { likes: 86, comments: 13, bookmarks: 29 },
  },
];

const features = [
  {
    title: "Focused writing",
    description:
      "Draft markdown articles, add excerpts and tags, preview your post, then publish when it feels ready.",
    icon: Edit3,
  },
  {
    title: "Personal discovery",
    description:
      "Follow tags and authors so the dashboard feed keeps surfacing posts that match your interests.",
    icon: Search,
  },
  {
    title: "Useful engagement",
    description:
      "Like, comment, reply, bookmark, and follow creators without turning reading into noise.",
    icon: MessageCircle,
  },
  {
    title: "Author insight",
    description:
      "Track views, unique readers, likes, comments, and saves from a stats dashboard built for writers.",
    icon: BarChart3,
  },
];

const workflow = [
  [
    "Write",
    "Start with a title, excerpt, markdown body, and tags that describe the idea.",
  ],
  [
    "Preview",
    "Review the article before publishing so formatting and flow feel polished.",
  ],
  [
    "Publish",
    "Move from draft to public article and make the post available in feeds and search.",
  ],
  [
    "Grow",
    "Learn from engagement, respond to comments, and build an audience around your topics.",
  ],
];

const capabilities = [
  "Markdown editor",
  "Draft previews",
  "Personalized feed",
  "Tag following",
  "Author following",
  "Nested replies",
  "Bookmarks",
  "Notifications",
  "Post analytics",
];

const audienceCards = [
  {
    title: "Writers",
    description:
      "A dashboard for drafting, publishing, and understanding how articles perform.",
    icon: BookOpenText,
  },
  {
    title: "Readers",
    description:
      "A calmer way to discover useful posts through followed tags, authors, and search.",
    icon: Tags,
  },
  {
    title: "Communities",
    description:
      "A place for shared learning with comments, replies, follows, and notifications.",
    icon: Users,
  },
];

const analytics = [
  { label: "Views", value: "400", icon: BarChart3 },
  { label: "Likes", value: "98", icon: Heart },
  { label: "Comments", value: "36", icon: MessageCircle },
  { label: "Bookmarks", value: "18", icon: Bookmark },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-base font-semibold tracking-tight">
              Chatterbox
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Write thoughtful posts. Find ideas worth following.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Chatterbox is a modern blogging platform where writers draft and
              publish markdown articles, readers discover posts through tags and
              authors, and every article can grow through comments, bookmarks,
              follows, notifications, and analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start writing
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                "Drafts to published posts",
                "Personalized discovery",
                "Stats for authors",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-4">
            <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Welcome back
                  </h2>
                </div>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    <Plus className="size-4" />
                    New article
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-3">
                  {feedPosts.map((post) => (
                    <article
                      key={post.title}
                      className="rounded-2xl border bg-card p-4"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-semibold leading-6">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="size-3.5" />
                          {post.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3.5" />
                          {post.stats.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="size-3.5" />
                          {post.stats.bookmarks}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="space-y-3">
                  <div className="rounded-2xl border bg-card p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium">Followed tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Next.js", "Writing", "Testing", "Design"].map(
                        (tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-4 rounded-full">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The tools of a blog, shaped like a social writing space.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Chatterbox supports the full content journey: writing, publishing,
            discovery, conversation, saving, following, and performance
            tracking.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="rounded-2xl shadow-sm">
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <Badge variant="secondary" className="mb-4 rounded-full">
              Workflow
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              From rough idea to published article.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              The app keeps publishing simple while still giving users the
              social and analytics features they expect from a modern content
              platform.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {workflow.map(([title, description], index) => (
              <Card key={title} className="rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <Badge variant="secondary" className="mb-4 rounded-full">
            Inside the app
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A complete publishing dashboard without the clutter.
          </h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            Users can move between creating posts, reading the feed, following
            tags, searching for articles, saving useful posts, and checking
            author stats from one connected workspace.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div
                key={capability}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 text-sm"
              >
                <Check className="size-4 text-emerald-600" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Author analytics</CardTitle>
            <CardDescription>
              A quick view of how readers respond to published work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                      <Icon className="size-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section id="audience" className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <Badge variant="secondary" className="mb-4 rounded-full">
              Audience
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for people who want useful ideas to keep moving.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="rounded-2xl shadow-sm">
                  <CardHeader>
                    <Icon className="mb-3 size-6" />
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border bg-primary p-8 text-primary-foreground shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Turn your next idea into a post people can find, save, and
              discuss.
            </h2>
            <p className="mt-4 text-primary-foreground/75">
              Create your account, follow the topics you care about, and start
              publishing inside Chatterbox.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Create account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Chatterbox. Built for social
            publishing.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

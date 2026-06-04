import {
  Home,
  FileText,
  FilePenLine,
  BarChart3,
  Bookmark,
} from "lucide-react";

export const sidebarLinks = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
  },
  {
    label: "Drafts",
    href: "/dashboard/drafts",
    icon: FilePenLine,
  },
  {
    label: "Stats",
    href: "/dashboard/stats",
    icon: BarChart3,
  },
  {
    label: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
  },
];
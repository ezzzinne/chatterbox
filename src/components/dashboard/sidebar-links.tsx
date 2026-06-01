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
    href: "/articles",
    icon: FileText,
  },
  {
    label: "Drafts",
    href: "/drafts",
    icon: FilePenLine,
  },
  {
    label: "Stats",
    href: "/stats",
    icon: BarChart3,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
];
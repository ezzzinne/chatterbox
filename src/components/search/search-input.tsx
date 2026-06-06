"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const trimmed = value.trim();

      startTransition(() => {
        if (trimmed.length >= 2) {
          router.replace(
            `/dashboard/search?q=${encodeURIComponent(trimmed)}` as Route,
          );
        } else {
          router.replace("/dashboard/search" as Route);
        }
      });
    }, 500);
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search posts..."
        className="h-10 w-full rounded-xl border px-4"
      />
    </div>
  );
}

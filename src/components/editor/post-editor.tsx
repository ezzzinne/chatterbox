"use client";

import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { PublishSidebar } from "@/components/editor/publish-sidebar";
import type { Tag } from "@/components/editor/tag-selector";

import { saveDraftAction } from "@/actions/posts";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type ExistingPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  selectedTags: Tag[];
};

type Props = {
  tags: Tag[];
  post?: ExistingPost;
};

type DraftState = {
  title: string;
  excerpt: string;
  content: string;
  status: string;
  selectedTags: Tag[];
};

export function PostEditor({ tags, post }: Props) {
  const [draft, setDraft] = useState<DraftState>({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    status: post?.status ?? "draft",
    selectedTags: post?.selectedTags ?? [],
  });

  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved",
  );

  const postIdRef = useRef<string | null | undefined>(post?.id ?? null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const saveDraft = async (draftToSave: DraftState, shouldRedirect = false) => {
    try {
      setSaveState("saving");

      const result = await saveDraftAction({
        postId: postIdRef.current,
        title: draftToSave.title,
        excerpt: draftToSave.excerpt,
        content: draftToSave.content,
        status: "draft",
        tagIds: draftToSave.selectedTags.map((tag) => tag.id),
      });

      if (result.skipped) {
        setSaveState("saved");
        return;
      }

      postIdRef.current = result.postId;

      setSaveState("saved");

      if (shouldRedirect) {
        router.push(`/dashboard/drafts/${result.postId}` as Route);
      }
    } catch (error) {
      console.error("Draft save failed:", error);
      setSaveState("error");
    }
  };

  const scheduleSave = (nextDraft: DraftState) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      saveDraft(nextDraft, false);
    }, 1500);
  };

  const updateDraft = <K extends keyof DraftState>(
    key: K,
    value: DraftState[K],
  ) => {
    const nextDraft = {
      ...draft,
      [key]: value,
    };

    setDraft(nextDraft);

    scheduleSave(nextDraft);
  };

  const handlePreview = async () => {
    if (!draft.content.trim()) {
      setSaveState("error");
      toast.error("Add content to save and preview.");
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    await saveDraft(draft, true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            Preview
          </Button>

          <Button variant="secondary" className="flex items-center gap-2">
            {saveState === "saving" && (
              <span className="text-sm text-muted-foreground">Saving...</span>
            )}

            {saveState === "error" && (
              <span className="text-sm text-destructive">Save failed</span>
            )}

            {saveState === "saved" && (
              <span className="text-sm text-muted-foreground">Saved</span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 pb-4">
        <Input
          placeholder="Post title"
          value={draft.title}
          onChange={(e) => updateDraft("title", e.target.value)}
        />

        <Textarea
          placeholder="Short excerpt"
          value={draft.excerpt}
          onChange={(e) => updateDraft("excerpt", e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <MarkdownEditor
          value={draft.content}
          onChange={(value) => updateDraft("content", value)}
        />

        <PublishSidebar
          tags={tags}
          selectedTags={draft.selectedTags}
          setSelectedTags={(value) => updateDraft("selectedTags", value)}
        />
      </div>
    </div>
  );
}

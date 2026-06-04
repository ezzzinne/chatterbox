"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { X } from "lucide-react";

export type Tag = {
  id: string;
  name: string;
};

type Props = {
  availableTags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

export function TagSelector({ availableTags, selectedTags, onChange }: Props) {
  const addTag = (tag: Tag) => {
    if (selectedTags.some((selected) => selected.id === tag.id)) {
      return;
    }

    if (selectedTags.length >= 5) {
      return;
    }

    onChange([...selectedTags, tag]);
  };

  const removeTag = (id: string) => {
    onChange(selectedTags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="cursor-pointer">
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Command className="rounded-lg border">
        <CommandInput placeholder="Search tags..." />

        <CommandEmpty>No tags found.</CommandEmpty>

        <CommandGroup>
          {availableTags.map((tag) => (
            <CommandItem key={tag.id} onSelect={() => addTag(tag)}>
              {tag.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>

      <p className="text-xs text-muted-foreground">
        {selectedTags.length}/5 tags selected
      </p>
    </div>
  );
}

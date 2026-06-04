import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TagSelector } from "./tag-selector";
import type { Tag } from "./tag-selector";

type Props = {
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
};

export function PublishSidebar({ tags, selectedTags, setSelectedTags }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Tags</CardTitle>
      </CardHeader>

      <CardContent>
        <TagSelector
          availableTags={tags}
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />
      </CardContent>
    </Card>
  );
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  content: Record<string, number>;
  media: Array<{
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }>;
}

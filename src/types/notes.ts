export type NoteMetadata = {
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  featured?: boolean;
};

export type Note = {
  metadata: NoteMetadata;
  slug: string;
  content: string;
};

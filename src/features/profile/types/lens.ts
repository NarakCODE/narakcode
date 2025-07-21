export type LensImage = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
};

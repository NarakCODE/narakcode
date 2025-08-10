import fs from "fs";
import matter from "gray-matter";
import path from "path";

import type { Note, NoteMetadata } from "@/types/notes";

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);

  return {
    metadata: file.data as NoteMetadata,
    content: file.content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map<Note>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));

    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getAllNotes() {
  return getMDXData(path.join(process.cwd(), "src", "content", "notes")).sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );
}

export function getAdjacentNotes(currentSlug: string) {
  const notes = getAllNotes();
  const currentIndex = notes.findIndex((note) => note.slug === currentSlug);

  return {
    previous: currentIndex > 0 ? notes[currentIndex - 1] : null,
    next: currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null,
  };
}

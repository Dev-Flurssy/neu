import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

export type NoteInput = z.infer<typeof noteSchema>;

export const noteUpdateSchema = noteSchema.partial();

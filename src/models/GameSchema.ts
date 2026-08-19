import { z } from "zod";

const QuestionTypeSchema = z.enum([
  "text",
  "number",
  "select",
  "code",
  "date"
]);

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

const QuestionSchema = z.object({
  type: QuestionTypeSchema,
  answer: z.string(),
  hints: z.array(z.string()).optional(),
  penaltySeconds: z.number().optional(),
  formatHelp: z.string().optional(),
  config: z.any().optional()
});

const GamePageSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  question: QuestionSchema.optional()
});

export const EscapeGameSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  durationMinutes: z.number().positive(),
  defaultPenaltySeconds: z.number().positive(),
  version: z.string(),
  author: z.string(),
  license: z.string().optional(),
  pages: z.array(GamePageSchema).min(1)
});
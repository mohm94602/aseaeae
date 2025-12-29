import { z } from "zod";

// Schema for the download request
export const downloadRequestSchema = z.object({
  platform: z.enum(["youtube", "tiktok", "instagram", "facebook"]),
  url: z.string().url("Please enter a valid URL"),
});

// Schema for a single download link option
export const downloadLinkSchema = z.object({
  quality: z.string(),
  format: z.string(),
  url: z.string(),
});

// Schema for the successful response
export const downloadResponseSchema = z.object({
  title: z.string(),
  thumbnail: z.string(),
  duration: z.string().optional(),
  downloadLinks: z.array(downloadLinkSchema),
});

// Export types
export type DownloadRequest = z.infer<typeof downloadRequestSchema>;
export type DownloadLink = z.infer<typeof downloadLinkSchema>;
export type DownloadResponse = z.infer<typeof downloadResponseSchema>;

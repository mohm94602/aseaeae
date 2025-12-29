import { useMutation } from "@tanstack/react-query";
import { api, type errorSchemas } from "@shared/routes";
import { z } from "zod";
import type { DownloadRequest, DownloadResponse } from "@shared/schema";

export function useProcessDownload() {
  return useMutation<DownloadResponse, Error, DownloadRequest>({
    mutationFn: async (data: DownloadRequest) => {
      // Validate input before sending (client-side check)
      const validated = api.download.process.input.parse(data);

      const res = await fetch(api.download.process.path, {
        method: api.download.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        // Try to parse structured error response
        try {
          const errorData = await res.json();
          // Check for validation error (400)
          if (res.status === 400) {
            const parsed = api.download.process.responses[400].parse(errorData);
            throw new Error(parsed.message || "Validation failed");
          }
          // Check for internal error (500)
          if (res.status === 500) {
            const parsed = api.download.process.responses[500].parse(errorData);
            throw new Error(parsed.message || "Server error");
          }
        } catch (e) {
          // Fallback if parsing fails or if it's another error type
          if (e instanceof Error) throw e;
        }
        throw new Error("Failed to process video");
      }

      // Parse success response
      const result = await res.json();
      return api.download.process.responses[200].parse(result);
    },
  });
}

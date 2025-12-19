import crypto from "crypto";

/**
 * Generates a deterministic hash for a URL
 * Used to detect duplicate links
 */
export const generateUrlHash = (url: string): string => {
  const normalizedUrl = url.trim().toLowerCase();

  return crypto
    .createHash("sha256")
    .update(normalizedUrl)
    .digest("hex");
};
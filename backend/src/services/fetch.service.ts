import axios from "axios";

/**
 * Fetches raw HTML content from a URL
 */
export const fetchHTML = async (url: string): Promise<string> => {
  try {
    const response = await axios.get<string>(url, {
      timeout: 10_000, // 10 seconds
      maxRedirects: 5,
      responseType: "text",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AI-URL-Summarizer/1.0; +https://example.com)",
        Accept: "text/html",
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const contentType = response.headers["content-type"];

    if (!contentType || !contentType.includes("text/html")) {
      throw new Error("URL did not return HTML content");
    }

    return response.data;
  } catch (error: any) {
    const message =
      error?.message || "Failed to fetch HTML from the given URL";

    throw new Error(`FetchService Error: ${message}`);
  }
};
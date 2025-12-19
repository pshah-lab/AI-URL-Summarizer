import * as cheerio from "cheerio";

/**
 * Extracts clean, readable text from raw HTML
 */
export const extractTextFromHTML = (html: string): string => {
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, noscript, iframe").remove();
  $("nav, footer, header, aside").remove();

  // Prefer semantic content containers
  let content = $("article").text();

  if (!content || content.trim().length === 0) {
    content = $("main").text();
  }

  if (!content || content.trim().length === 0) {
    content = $("body").text();
  }

  return normalizeText(content);
};

/**
 * Normalizes extracted text by cleaning whitespace
 */
const normalizeText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
};
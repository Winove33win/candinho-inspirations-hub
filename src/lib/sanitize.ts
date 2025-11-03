import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Used before rendering rich text content with dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  
  // Configure DOMPurify to allow safe HTML elements
  const config = {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", 
      "h1", "h2", "h3", "blockquote", "code", "pre"
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  };

  return DOMPurify.sanitize(dirty, config);
}

/**
 * Strips all HTML tags from content
 * Used for plain text extraction
 */
export function stripHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

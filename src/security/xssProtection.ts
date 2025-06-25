/**
 * XSS Prevention Service
 * Provides comprehensive XSS protection using DOMPurify and additional security measures
 */

import DOMPurify from "dompurify";

// XSS Protection Configuration
const XSS_CONFIG = {
  // DOMPurify configuration for different contexts
  STRICT_HTML: {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
    FORCE_BODY: false,
  },
  USER_CONTENT: {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
    ],
    ALLOWED_ATTR: ["href", "title"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    SANITIZE_DOM: true,
  },
  PLAIN_TEXT: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
  },
};

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  // Script injection patterns
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,

  // Event handler patterns
  /on\w+\s*=/gi,
  /formaction\s*=/gi,
  /fscommand/gi,

  // CSS injection patterns
  /expression\s*\(/gi,
  /behavior\s*:/gi,
  /-moz-binding/gi,

  // Data URI patterns (context-specific)
  /data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml))[^;]*/gi,

  // Meta refresh and base href
  /<meta[^>]*?http-equiv[^>]*?refresh/gi,
  /<base[^>]*?href/gi,
];

class XSSProtectionService {
  private purify: typeof DOMPurify;

  constructor() {
    this.purify = DOMPurify;
    this.configureDOMPurify();
  }

  /**
   * Configure DOMPurify with security enhancements
   */
  private configureDOMPurify(): void {
    // Add custom hooks for enhanced security
    this.purify.addHook("beforeSanitizeElements", (node, data) => {
      // Remove any node with suspicious attributes
      if (node.nodeType === 1) {
        // Element node
        const element = node as Element;

        // Check for dangerous attributes
        const dangerousAttrs = [
          "onload",
          "onerror",
          "onmouseover",
          "onfocus",
          "onblur",
        ];
        dangerousAttrs.forEach((attr) => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });

        // Remove data URIs except for images
        if (element.hasAttribute("src") || element.hasAttribute("href")) {
          const src =
            element.getAttribute("src") || element.getAttribute("href");
          if (
            src &&
            src.startsWith("data:") &&
            !src.startsWith("data:image/")
          ) {
            element.removeAttribute("src");
            element.removeAttribute("href");
          }
        }
      }
    });

    this.purify.addHook("afterSanitizeAttributes", (node) => {
      // Ensure target="_blank" has rel="noopener noreferrer"
      if (node.nodeType === 1) {
        const element = node as Element;
        if (
          element.hasAttribute("target") &&
          element.getAttribute("target") === "_blank"
        ) {
          element.setAttribute("rel", "noopener noreferrer");
        }
      }
    });
  }

  /**
   * Sanitize HTML content with strict settings
   */
  sanitizeHTML(
    input: string,
    config: keyof typeof XSS_CONFIG = "STRICT_HTML",
  ): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    try {
      // Pre-check for dangerous patterns
      const hasDangerousContent = DANGEROUS_PATTERNS.some((pattern) =>
        pattern.test(input),
      );
      if (hasDangerousContent) {
        console.warn("XSS: Dangerous content detected and will be sanitized", {
          input: input.substring(0, 100) + "...",
          timestamp: new Date().toISOString(),
        });
      }

      // Sanitize with DOMPurify
      const sanitized = this.purify.sanitize(input, XSS_CONFIG[config]);

      // Additional validation
      if (sanitized !== input) {
        this.logSanitization(input, sanitized, config);
      }

      return sanitized;
    } catch (error) {
      console.error("XSS sanitization error:", error);
      return ""; // Return empty string on error
    }
  }

  /**
   * Sanitize plain text by removing all HTML tags
   */
  sanitizeText(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    try {
      // First pass: Remove HTML tags
      let sanitized = this.purify.sanitize(input, XSS_CONFIG.PLAIN_TEXT);

      // Second pass: Decode HTML entities and re-encode dangerous characters
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = sanitized;
      sanitized = tempDiv.textContent || tempDiv.innerText || "";

      // Third pass: Remove any remaining control characters
      sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      return sanitized;
    } catch (error) {
      console.error("Text sanitization error:", error);
      return "";
    }
  }

  /**
   * Sanitize user input for display in rich text contexts
   */
  sanitizeUserContent(input: string): string {
    return this.sanitizeHTML(input, "USER_CONTENT");
  }

  /**
   * Validate and sanitize URLs
   */
  sanitizeURL(url: string): string {
    if (!url || typeof url !== "string") {
      return "";
    }

    try {
      // Remove dangerous protocols
      const dangerousProtocols = [
        "javascript:",
        "vbscript:",
        "data:",
        "file:",
        "ftp:",
      ];
      const lowerUrl = url.toLowerCase();

      for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
          return "";
        }
      }

      // Only allow HTTP(S) and mailto protocols
      const allowedProtocols = /^(https?:\/\/|mailto:|tel:|#)/i;
      if (!allowedProtocols.test(url) && !url.startsWith("/")) {
        return "";
      }

      // Encode dangerous characters
      return encodeURI(url);
    } catch (error) {
      console.error("URL sanitization error:", error);
      return "";
    }
  }

  /**
   * Sanitize CSS values
   */
  sanitizeCSS(css: string): string {
    if (!css || typeof css !== "string") {
      return "";
    }

    try {
      // Remove dangerous CSS patterns
      let sanitized = css
        .replace(/expression\s*\(/gi, "")
        .replace(/behavior\s*:/gi, "")
        .replace(/-moz-binding/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/vbscript:/gi, "")
        .replace(/data:/gi, "")
        .replace(/@import/gi, "")
        .replace(/\/\*[\s\S]*?\*\//g, ""); // Remove comments

      // Only allow safe CSS properties (whitelist approach)
      const safeCSSProps = [
        "color",
        "background-color",
        "font-size",
        "font-weight",
        "font-family",
        "text-align",
        "text-decoration",
        "margin",
        "padding",
        "border",
        "width",
        "height",
        "display",
        "position",
        "top",
        "left",
        "right",
        "bottom",
      ];

      // Basic validation - ensure only safe properties are used
      const cssRules = sanitized.split(";");
      const safeCSSRules = cssRules.filter((rule) => {
        const [property] = rule.split(":");
        return (
          property &&
          safeCSSProps.some((safeProp) =>
            property.trim().toLowerCase().includes(safeProp),
          )
        );
      });

      return safeCSSRules.join(";");
    } catch (error) {
      console.error("CSS sanitization error:", error);
      return "";
    }
  }

  /**
   * Sanitize JSON data
   */
  sanitizeJSON(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    try {
      if (typeof data === "string") {
        return this.sanitizeText(data);
      }

      if (typeof data === "object") {
        if (Array.isArray(data)) {
          return data.map((item) => this.sanitizeJSON(item));
        }

        const sanitized: any = {};
        for (const [key, value] of Object.entries(data)) {
          const sanitizedKey = this.sanitizeText(key);
          sanitized[sanitizedKey] = this.sanitizeJSON(value);
        }
        return sanitized;
      }

      return data;
    } catch (error) {
      console.error("JSON sanitization error:", error);
      return {};
    }
  }

  /**
   * Check if content contains potential XSS
   */
  containsXSS(input: string): boolean {
    if (!input || typeof input !== "string") {
      return false;
    }

    return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
  }

  /**
   * Log sanitization events for security monitoring
   */
  private logSanitization(
    original: string,
    sanitized: string,
    config: string,
  ): void {
    // Only log in development or when specifically enabled
    if (
      process.env.NODE_ENV === "development" ||
      process.env.VITE_LOG_XSS_EVENTS === "true"
    ) {
      console.warn("XSS: Content was sanitized", {
        config,
        originalLength: original.length,
        sanitizedLength: sanitized.length,
        timestamp: new Date().toISOString(),
        // Don't log the actual content to avoid exposing sensitive data
      });
    }

    // Send to security monitoring service (implement based on your monitoring solution)
    this.reportXSSAttempt(original, sanitized, config);
  }

  /**
   * Report XSS attempt to security monitoring
   */
  private reportXSSAttempt(
    original: string,
    sanitized: string,
    config: string,
  ): void {
    try {
      // Send to your security monitoring service
      // Example: Analytics, Sentry, custom logging service
      if (window.gtag) {
        window.gtag("event", "xss_attempt", {
          event_category: "security",
          event_label: "content_sanitized",
          custom_parameter_1: config,
        });
      }

      // Send to server-side logging
      if (navigator.sendBeacon) {
        const logData = {
          type: "xss_sanitization",
          config,
          originalLength: original.length,
          sanitizedLength: sanitized.length,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        navigator.sendBeacon("/api/security/log", JSON.stringify(logData));
      }
    } catch (error) {
      console.error("Failed to report XSS attempt:", error);
    }
  }
}

// Create singleton instance
export const xssProtection = new XSSProtectionService();

// React hook for XSS protection
export const useXSSProtection = () => {
  return {
    sanitizeHTML: (input: string, config?: keyof typeof XSS_CONFIG) =>
      xssProtection.sanitizeHTML(input, config),
    sanitizeText: (input: string) => xssProtection.sanitizeText(input),
    sanitizeUserContent: (input: string) =>
      xssProtection.sanitizeUserContent(input),
    sanitizeURL: (url: string) => xssProtection.sanitizeURL(url),
    sanitizeCSS: (css: string) => xssProtection.sanitizeCSS(css),
    sanitizeJSON: (data: any) => xssProtection.sanitizeJSON(data),
    containsXSS: (input: string) => xssProtection.containsXSS(input),
  };
};

// Export types and constants
export { XSS_CONFIG, DANGEROUS_PATTERNS };
export type XSSConfigType = keyof typeof XSS_CONFIG;

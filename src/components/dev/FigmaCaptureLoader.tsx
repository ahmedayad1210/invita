"use client";

import { useEffect } from "react";

/**
 * Loads Figma html-to-design capture when #figmacapture= is present.
 * Used only during design sync — safe to leave in production (no-op without hash).
 */
export default function FigmaCaptureLoader() {
  useEffect(() => {
    if (!window.location.hash.includes("figmacapture")) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          "https://mcp.figma.com/mcp/html-to-design/capture.js"
        );
        const source = await res.text();
        if (cancelled) return;

        const script = document.createElement("script");
        script.textContent = source;
        script.dataset.figmaCapture = "true";
        document.head.appendChild(script);
      } catch {
        // Fallback: external script tag
        const script = document.createElement("script");
        script.src = "https://mcp.figma.com/mcp/html-to-design/capture.js";
        script.async = true;
        script.dataset.figmaCapture = "true";
        document.head.appendChild(script);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

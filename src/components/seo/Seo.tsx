import { useEffect } from "react";

type MetaTag = { name?: string; property?: string; content: string };

interface SeoProps {
  title: string;
  description?: string;
  openGraph?: MetaTag[];
  twitter?: MetaTag[];
  jsonLd?: Record<string, unknown>;
}

function upsertMetaTag(tag: MetaTag) {
  if (typeof document === "undefined") return;
  const selector = tag.name ? `meta[name="${tag.name}"]` : tag.property ? `meta[property="${tag.property}"]` : null;
  if (!selector) return;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    if (tag.name) element.name = tag.name;
    if (tag.property) element.setAttribute("property", tag.property);
    document.head.appendChild(element);
  }
  element.content = tag.content;
}

export function Seo({ title, description, openGraph = [], twitter = [], jsonLd }: SeoProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;
    if (description) {
      upsertMetaTag({ name: "description", content: description });
    }

    openGraph.forEach(upsertMetaTag);
    twitter.forEach(upsertMetaTag);

    const scriptId = "smartx-jsonld";
    if (jsonLd) {
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = scriptId;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      if (!jsonLd) return;
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [title, description, openGraph, twitter, jsonLd]);

  return null;
}

export default Seo;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeoForPath } from "@/config/seo";

/**
 * Dynamically sets <title>, meta description, canonical, and OG tags
 * based on the current route.
 */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);

    // Title
    document.title = seo.title;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "description", seo.description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", seo.canonical);

    // Open Graph
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", seo.canonical);
    setMeta("property", "og:type", "website");
    if (seo.ogImage) {
      setMeta("property", "og:image", seo.ogImage);
    }

    // Twitter
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    if (seo.ogImage) {
      setMeta("name", "twitter:image", seo.ogImage);
    }
  }, [pathname]);

  return null;
}

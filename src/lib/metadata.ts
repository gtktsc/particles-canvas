import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function buildPageMetadata(): Metadata {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
  };
}

import type { Practice } from "@models/mongodb";
import type { JournalCustomStepConfig } from "@models/types";

export type PageItem = Practice | JournalCustomStepConfig;

export type PageSection = {
  title: string;
  icon?: string;
  pages: PageItem[];
};

export function isOwnPage(page: PageItem, userId?: string): boolean {
  if (!("creatorId" in page) || !page.creatorId || !userId) return false;
  return page.creatorId.toString() === userId;
}
